import { createSlice } from '@reduxjs/toolkit';

// Inicijalno stanje korpe i podataka koji se vuku iz memorije pretraživača
const initialState = localStorage.getItem('cart')
  ? JSON.parse(localStorage.getItem('cart'))
  : { cartItems: [], shippingAddress: {}, paymentMethod: 'PayPal', gymCode: '' };

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id ? item : x
        );
      } else {
        state.cartItems = [...state.cartItems, item];
      }
      
      // Računanje cena (bez poreza i komplikacija, čist sportski šop)
      const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      state.itemsPrice = itemsPrice;
      state.shippingPrice = itemsPrice > 5000 ? 0 : 350; // Besplatna dostava preko 5000 RSD
      state.taxPrice = Number((0.20 * itemsPrice).toFixed(2)); // PDV 20%
      state.totalPrice = itemsPrice + state.shippingPrice;

      localStorage.setItem('cart', JSON.stringify(state));
    },

    removeFromCart: (state, action) => {
      state.cartItems = state.cartItems.filter((x) => x._id !== action.payload);
      
      const itemsPrice = state.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
      state.itemsPrice = itemsPrice;
      state.shippingPrice = itemsPrice > 5000 || itemsPrice === 0 ? 0 : 350;
      state.totalPrice = itemsPrice + state.shippingPrice;

      localStorage.setItem('cart', JSON.stringify(state));
    },

    saveShippingAddress: (state, action) => {
      state.shippingAddress = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    savePaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    // ⚡ NAŠA NOVA AKCIJA ZA ČLANSKI KOD KOJA REŠAVA GREŠKU ⚡
    saveGymCode: (state, action) => {
      state.gymCode = action.payload;
      localStorage.setItem('cart', JSON.stringify(state));
    },

    clearCartItems: (state) => {
      state.cartItems = [];
      localStorage.setItem('cart', JSON.stringify(state));
    },
  },
});

// Eksportujemo sve akcije da bi ekrani mogli da ih koriste bez greške
export const {
  addToCart,
  removeFromCart,
  saveShippingAddress,
  savePaymentMethod,
  saveGymCode, // <- Dodato za izvoz!
  clearCartItems,
} = cartSlice.actions;

export default cartSlice.reducer;