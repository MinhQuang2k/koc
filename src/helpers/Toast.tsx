import React from 'react'
import {
  ToastContainer as ToastContainerDefault,
  toast,
  ToastContent,
} from 'react-toastify'

import 'react-toastify/dist/ReactToastify.css'

export const ToastContainer = () => {
  return (
    <ToastContainerDefault
      position="top-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
    />
  )
}

class ToastUtil {
  public info(message: ToastContent, opts = {}) {
    toast.info(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public success(message: ToastContent, opts = {}) {
    toast.success(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public warning(message: ToastContent, opts = {}) {
    toast.warn(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }

  public error(message: ToastContent, opts = {}) {
    toast.error(message, {
      position: 'top-center',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      ...opts,
    })
  }
}

export const toastUtil = new ToastUtil()
