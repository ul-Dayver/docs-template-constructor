import React from 'react'
import Modal from './modal'

export default ({show, closeMessage}) => (
  <Modal
    isActive={!!show.alert && show.alert.length}
    clickClose={closeMessage}
    title={'Сообщение'}
  >
    <p>{show.alert}</p>
  </Modal>
)