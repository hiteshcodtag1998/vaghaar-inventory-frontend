import { Bounce, toast } from 'react-toastify';
import { TOAST_POSITION, TOAST_TYPE } from './constant';

const { TYPE_DEFAULT } = TOAST_TYPE
const { POSITION_TOP_RIGHT } = TOAST_POSITION

export const toastMessage = (message, type = TYPE_DEFAULT, position = POSITION_TOP_RIGHT) => {
    toast(message, {
        position,
        type,
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
    });
}