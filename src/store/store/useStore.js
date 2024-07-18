// store.js
import { create } from 'zustand';
import { db } from '../../services/firebase.service';
import { nanoid } from 'nanoid';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc } from 'firebase/firestore';

const useStore = create((set) => ({
  products: [],
  cart: [],
  orders: [],
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
    const newProduct = { ...product, cartId: nanoid(), number: 1, extras };
    return { cart: [...state.cart, newProduct] };
  }),
  incrementProduct: (cartId) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId ? { ...item, number: item.number + 1 } : item)
  })),
  decrementProduct: (cartId) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId && item.number > 1 ? { ...item, number: item.number - 1 } : item)
  })),
  addExtra: (cartId, extra) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId ? { ...item, extras: [...item.extras, extra] } : item)
  })),
  removeExtra: (cartId, extra) => set((state) => ({
    cart: state.cart.map((item) => item.cartId === cartId ? { ...item, extras: item.extras.filter(e => e !== extra) } : item)
  })),
  resetCart: () => set({ cart: [] }),
  removeFromCart: (cartId) => set((state) => ({
    cart: state.cart.filter((item) => item.cartId !== cartId)
  }))
}));

export default useStore;
