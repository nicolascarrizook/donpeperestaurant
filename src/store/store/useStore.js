// store.js
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import {
  addDoc,
  collection,
  deleteDoc,
  deleteField,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { nanoid } from "nanoid";
import { create } from "zustand";
import { auth, db } from "../../services/firebase.service";

export const CATEGORIES = {
  MINUTAS: "minutas",
  SANDWICHES: "sandwiches",
  MIGA: "miga",
  PIZZAS: "pizzas",
  CERVEZAS: "cervezas",
  GASEOSAS: "gaseosas",
};

const DEFAULT_EXTRAS = {
  Queso: 450,
  Jamon: 450,
  Huevo: 450,
};

const useStore = create((set, get) => ({
  user: null,
  authError: null,
  successMessage: null,
  showLoading: false,
  products: [],
  cart: [],
  orders: [],
  categories: Object.values(CATEGORIES),
  extrasPrices: {},
  loading: false,
  error: null,

  getProductsByCategory: (category) => {
    const { products } = get();
    return products.filter(
      (product) => product.category.toLowerCase() === category.toLowerCase()
    );
  },

  login: async (email, password) => {
    set({ showLoading: true, authError: null, successMessage: null });
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      localStorage.setItem("authToken", userCredential.user.accessToken);
      set({
        user: userCredential.user,
        showLoading: false,
        successMessage: "Login successful!",
      });
    } catch (error) {
      set({
        authError: error.message,
        showLoading: false,
      });
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("authToken");
      set({ user: null });
    } catch (error) {
      console.error("Error logging out: ", error);
    }
  },

  resetAuthError: () => set({ authError: null }),

  fetchOrders: async () => {
    set({ loading: true });
    try {
      console.log("Iniciando fetchOrders");

      const ordersQuery = query(
        collection(db, "orders"),
        orderBy("date", "desc"),
        limit(200)
      );

      const ordersSnapshot = await getDocs(ordersQuery);

      // Usar un Map para eliminar duplicados basados en orderId
      const ordersMap = new Map();

      ordersSnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const orderId = data.orderId || doc.id;

        // Solo guardar la orden si no existe o si es más reciente
        if (
          !ordersMap.has(orderId) ||
          new Date(data.date) > new Date(ordersMap.get(orderId).date)
        ) {
          ordersMap.set(orderId, {
            id: doc.id,
            ...data,
          });
        }
      });

      // Convertir el Map a array
      const orders = Array.from(ordersMap.values());

      // Ordenar por fecha descendente
      orders.sort((a, b) => new Date(b.date) - new Date(a.date));

      console.log("Órdenes procesadas (sin duplicados):", orders.length);

      set({ orders, loading: false });
    } catch (error) {
      console.error("Error en fetchOrders:", error);
      set({ loading: false });
    }
  },

  fetchProducts: async () => {
    set({ loading: true });
    try {
      const querySnapshot = await getDocs(collection(db, "products"));
      const productsData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      set({
        products: productsData,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error("Error fetching products:", error);
      set({
        error: error.message,
        loading: false,
      });
    }
  },

  addProduct: async (product) => {
    try {
      if (!Object.values(CATEGORIES).includes(product.category.toLowerCase())) {
        throw new Error("Categoría inválida");
      }

      const productToAdd = {
        ...product,
        category: product.category.toLowerCase(),
      };

      const docRef = await addDoc(collection(db, "products"), productToAdd);
      set((state) => ({
        products: [...state.products, { id: docRef.id, ...productToAdd }],
      }));
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  },

  updateProduct: async (productToUpdate) => {
    set({ loading: true });
    try {
      const docRef = doc(db, "products", productToUpdate.id);

      // Asegurarse de que stock sea booleano
      const productData = {
        name: productToUpdate.name,
        description: productToUpdate.description,
        price: productToUpdate.price,
        category: productToUpdate.category,
        stock: Boolean(productToUpdate.stock), // Forzar conversión a booleano
      };

      console.log("Datos a guardar en Firestore:", productData); // Para debug

      await updateDoc(docRef, productData);
      await get().fetchProducts();

      set({ loading: false, error: null });
      return true;
    } catch (error) {
      console.error("Error updating product:", error);
      set({ error: error.message, loading: false });
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const productRef = doc(db, "products", productId);
      await deleteDoc(productRef);
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId),
      }));
    } catch (error) {
      console.error("Error deleting product: ", error);
    }
  },

  addToCart: (product, extras = []) =>
    set((state) => {
      const newProduct = {
        ...product,
        cartId: nanoid(),
        number: 1,
        extras,
        extraPrices: {},
      };
      return { cart: [...state.cart, newProduct] };
    }),

  incrementProduct: (cartId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId ? { ...item, number: item.number + 1 } : item
      ),
    })),

  decrementProduct: (cartId) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId && item.number > 1
          ? { ...item, number: item.number - 1 }
          : item
      ),
    })),

  addExtra: (cartId, extra, price) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.cartId === cartId
          ? {
              ...item,
              extras: [...item.extras, extra],
              extraPrices: {
                ...item.extraPrices,
                [extra]: parseFloat(price) || 0,
              },
            }
          : item
      ),
    })),

  removeExtra: async (extra) => {
    try {
      const docRef = doc(db, "config", "extras");
      await updateDoc(docRef, {
        [`prices.${extra}`]: deleteField(),
      });
      set((state) => {
        const newPrices = { ...state.extrasPrices };
        delete newPrices[extra];
        return { extrasPrices: newPrices };
      });
    } catch (error) {
      console.error("Error removing extra:", error);
    }
  },

  updateExtraPrice: async (extra, price) => {
    try {
      const pricesRef = doc(db, "extras", "prices");

      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        throw new Error("Precio inválido");
      }

      const docSnap = await getDoc(pricesRef);

      if (!docSnap.exists()) {
        await setDoc(pricesRef, {
          [extra]: numericPrice,
        });
      } else {
        await updateDoc(pricesRef, {
          [extra]: numericPrice,
        });
      }

      // Recargar los precios después de actualizar
      await get().fetchExtrasPrices();

      return true;
    } catch (error) {
      console.error("Error updating extra price:", error);
      return false;
    }
  },

  resetCart: () => set({ cart: [] }),

  removeFromCart: (cartId) =>
    set((state) => ({
      cart: state.cart.filter((item) => item.cartId !== cartId),
    })),

  addNewExtra: async (name, price) => {
    try {
      const pricesRef = doc(db, "extras", "prices");
      const docSnap = await getDoc(pricesRef);

      const numericPrice = Number(price);
      if (isNaN(numericPrice)) {
        throw new Error("Precio inválido");
      }

      if (!docSnap.exists()) {
        // Si el documento no existe, crearlo con el primer extra
        await setDoc(pricesRef, {
          [name]: numericPrice,
        });
      } else {
        // Si existe, obtener los precios actuales y agregar el nuevo
        const currentPrices = docSnap.data();
        await updateDoc(pricesRef, {
          ...currentPrices,
          [name]: numericPrice,
        });
      }

      // Actualizar el estado local
      set((state) => ({
        extrasPrices: {
          ...state.extrasPrices,
          [name]: numericPrice,
        },
      }));

      // Recargar los precios
      await get().fetchExtrasPrices();

      return true;
    } catch (error) {
      console.error("Error adding new extra:", error);
      return false;
    }
  },

  // Función para cargar los precios
  fetchExtrasPrices: async () => {
    try {
      const pricesRef = doc(db, "extras", "prices");
      const docSnap = await getDoc(pricesRef);

      if (docSnap.exists()) {
        const prices = docSnap.data();
        set({ extrasPrices: prices });
      }
    } catch (error) {
      console.error("Error fetching extras prices:", error);
    }
  },

  deleteOrder: async (orderId) => {
    try {
      if (!orderId) {
        throw new Error("ID de orden no válido");
      }

      set({ loading: true });

      // Referencia al documento
      const orderRef = doc(db, "orders", orderId);

      // Eliminar el documento
      await deleteDoc(orderRef);

      // Actualizar el estado eliminando la orden
      set((state) => ({
        orders: state.orders.filter((order) => order.id !== orderId),
        loading: false,
      }));

      return true;
    } catch (error) {
      console.error("Error deleting order:", error);
      set({ loading: false, error: error.message });
      throw error;
    }
  },
}));

export default useStore;
