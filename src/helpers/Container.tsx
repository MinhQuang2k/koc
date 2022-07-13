import React, { FC } from 'react'
import { Container as ContainerBootstrap, Row, Col } from 'react-bootstrap'

interface ContainerProps {
  containerProps?: Record<string, any>
  rowProps?: Record<string, any>
  colProps?: Record<string, any>
}

const Container: FC<ContainerProps> = (props: ContainerProps) => {
  const { containerProps, rowProps, colProps } = props
  return (
    <ContainerBootstrap {...containerProps}>
      <Row {...rowProps}>
        <Col {...colProps}>1 of 3</Col>
        <Col xs={6} {...colProps}>
          2 of 3 (wider)
        </Col>
        <Col {...colProps}>3 of 3</Col>
      </Row>
    </ContainerBootstrap>
  )
}

export default Container
