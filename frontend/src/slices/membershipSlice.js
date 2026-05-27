import { createSlice } from '@reduxjs/toolkit';

const initialState = localStorage.getItem('membership')
  ? JSON.parse(localStorage.getItem('membership'))
  : { membershipPackage: null, paymentMethod: 'PayPal' };

const membershipSlice = createSlice({
  name: 'membership',
  initialState,
  reducers: {
    saveMembershipPackage: (state, action) => {
      state.membershipPackage = action.payload;
      state.totalPrice = action.payload.price;
      localStorage.setItem('membership', JSON.stringify(state));
    },

    saveMembershipPaymentMethod: (state, action) => {
      state.paymentMethod = action.payload;
      localStorage.setItem('membership', JSON.stringify(state));
    },

    clearMembership: (state) => {
      state.membershipPackage = null;
      state.paymentMethod = 'PayPal';
      state.totalPrice = 0;
      localStorage.removeItem('membership');
    },
  },
});

export const {
  saveMembershipPackage,
  saveMembershipPaymentMethod,
  clearMembership,
} = membershipSlice.actions;

export default membershipSlice.reducer;
