import { db } from '../src/services/firebase.service';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const ORDER_DOC_ID = 'counter';

const getOrderNumber = async () => {
    const docRef = doc(db, 'orderCounter', ORDER_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const today = new Date().toISOString().split('T')[0];

        if (data.date === today) {
            return data.orderNumber;
        } else {
            await setDoc(docRef, { date: today, orderNumber: 1 });
            return 1;
        }
    } else {
        await setDoc(docRef, { date: new Date().toISOString().split('T')[0], orderNumber: 1 });
        return 1;
    }
};

const incrementOrderNumber = async () => {
    const docRef = doc(db, 'orderCounter', ORDER_DOC_ID);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        const data = docSnap.data();
        const today = new Date().toISOString().split('T')[0];

        if (data.date === today) {
            const newOrderNumber = data.orderNumber + 1;
            await setDoc(docRef, { date: today, orderNumber: newOrderNumber });
            return newOrderNumber;
        } else {
            await setDoc(docRef, { date: today, orderNumber: 1 });
            return 1;
        }
    } else {
        await setDoc(docRef, { date: new Date().toISOString().split('T')[0], orderNumber: 1 });
        return 1;
    }
};

const createOrder = async (orderData) => {
    await addDoc(collection(db, 'orders'), orderData);
};

export { getOrderNumber, incrementOrderNumber, createOrder };
