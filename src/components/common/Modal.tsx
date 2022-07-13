import React, { FC } from 'react'
import { observer, inject } from 'mobx-react'
import { toJS } from 'mobx'
import Modal from 'react-bootstrap/Modal'
import ModalStore from '@src/stores/modal.store'
import RootStore from '@src/stores/RootStore'
import dayjs from 'dayjs'

interface ModalMessageProps {
  modalStore?: ModalStore
}

const ModalMessage: FC<ModalMessageProps> = (props: ModalMessageProps) => {
  const { modalStore } = props
  console.log(`🚀 ~ file: Modal.tsx ~ line 15 ~ modalStore`, toJS(modalStore))

  const handleCloseModal = () => {
    modalStore.setIsshow(false)
  }

  if (typeof modalStore?.content === 'object') {
    const {
      phone,
      totalBill,
      merchantName,
      transactionId,
      transactionDate,
      code,
    } = modalStore?.content || {}
    return (
      <React.Fragment>
        <Modal
          show={modalStore?.isShow}
          onHide={handleCloseModal}
          centered
          className="c-payment-modal"
        >
          <Modal.Header closeButton>
            {code === 0 || code === '0' ? 'THÀNH CÔNG' : 'THẤT BẠI'}
          </Modal.Header>
          <Modal.Body>
            <div>
              <h1>{merchantName}</h1>
              <p>{phone}</p>
              <p>{totalBill}</p>
              <p>{transactionId}</p>
              <p>{dayjs(transactionDate).format('DD-MM-YYYY hh:mm')}</p>
            </div>
          </Modal.Body>
        </Modal>
      </React.Fragment>
    )
  }

  return (
    <React.Fragment>
      <Modal
        show={modalStore?.isShow}
        onHide={handleCloseModal}
        centered
        className="c-payment-modal"
      >
        <Modal.Header closeButton>THÔNG BÁO</Modal.Header>
        <Modal.Body>{modalStore?.content ?? ''}</Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default inject(({ store }: { store: RootStore }) => {
  return {
    modalStore: store?.modalStore,
  }
})(observer(ModalMessage))
