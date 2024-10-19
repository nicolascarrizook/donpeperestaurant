// store.js
import { create } from 'zustand';
import { db, auth } from '../../services/firebase.service';
import { nanoid } from 'nanoid';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';

const useStore = create((set) => ({
  user: null,
  authError: null,
  successMessage: null,
  showLoading: false,
  products: [],
  cart: [],
  orders: [],
  login: async (email, password) => {
    set({ showLoading: true, authError: null, successMessage: null });
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Guardar el token en el almacenamiento local si es necesario
      localStorage.setItem('authToken', userCredential.user.accessToken);

      set({
        user: userCredential.user,
        showLoading: false,
        successMessage: 'Login successful!',
      });

      // Eliminar la redirección desde aquí

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
      localStorage.removeItem('authToken'); // Remover el token al cerrar sesión
      set({ user: null });
    } catch (error) {
      console.error('Error logging out: ', error);
    }
  },

  resetAuthError: () => set({ authError: null }),
  fetchOrders: async () => {
    try {
      const ordersSnapshot = await getDocs(collection(db, 'orders'));
      const orders = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ orders });
    } catch (error) {
      console.error('Error fetching orders: ', error);
    }
  },
  fetchProducts: async () => {
    try {
      const productsSnapshot = await getDocs(collection(db, 'products'));
      const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      set({ products });
    } catch (error) {
      console.error('Error fetching products: ', error);
    }
  },
  addProduct: async (product) => {
    try {
      const docRef = await addDoc(collection(db, 'products'), product);
      set((state) => ({
        products: [...state.products, { id: docRef.id, ...product }]
      }));
    } catch (error) {
      console.error('Error adding product: ', error);
    }
  },
  updateProduct: async (updatedProduct) => {
    try {
      const productRef = doc(db, 'products', updatedProduct.id);
      await updateDoc(productRef, updatedProduct);
      set((state) => ({
        products: state.products.map((product) =>
          product.id === updatedProduct.id ? updatedProduct : product)
      }));
    } catch (error) {
      console.error('Error updating product: ', error);
    }
  },
  deleteProduct: async (productId) => {
    try {
      const productRef = doc(db, 'products', productId);
      await deleteDoc(productRef);
      set((state) => ({
        products: state.products.filter((product) => product.id !== productId)
      }));
    } catch (error) {
      console.error('Error deleting product: ', error);
    }
  },
  addToCart: (product, extras = []) => set((state) => {
    const newProduct = {
      ...product,
      cartId: nanoid(),
      number: 1,
      extras,
      extraPrices: {}
    };
    return { cart: [...state.cart, newProduct] };
  }),

  incrementProduct: (cartId) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId ? { ...item, number: item.number + 1 } : item)
  })),
  decrementProduct: (cartId) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId && item.number > 1 ? { ...item, number: item.number - 1 } : item)
  })),
  addExtra: (cartId, extra, price) => set((state) => ({
    cart: state.cart.map((item) =>
      item.cartId === cartId
        ? {
          ...item,
          extras: [...item.extras, extra],
          extraPrices: { ...item.extraPrices, [extra]: parseFloat(price) || 0 }
        }
        : item
    )
  })),
  removeExtra: (cartId, extra) => set((state) => ({
    cart: state.cart.map((item) =>
      item.cartId === cartId
        ? {
          ...item,
          extras: item.extras.filter(e => e !== extra),
          extraPrices: { ...item.extraPrices, [extra]: undefined }
        }
        : item
    )
  })),
  updateExtraPrice: (cartId, extra, price) => set((state) => ({
    cart: state.cart.map((item) =>
      item.cartId === cartId
        ? {
          ...item,
          extraPrices: { ...item.extraPrices, [extra]: parseFloat(price) || 0 }
        }
        : item
    )
  })),
  resetCart: () => set({ cart: [] }),
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter((item) => item.cartId !== cartId)
  }))
}));

export default useStore;
