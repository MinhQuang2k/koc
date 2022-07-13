import React, { Component } from 'react'
import Countdown, { CountdownApi, CountdownRenderProps } from 'react-countdown'
import { observer, inject } from 'mobx-react'

interface CountdownProps {
  isShowEnterOtp: boolean
  setIsShowEnterOtp: React.Dispatch<React.SetStateAction<boolean>>
}

@inject('store')
@observer
export default class CountdownApiExample extends Component<CountdownProps> {
  countdownApi: CountdownApi | null = null
  state = { date: Date.now() + 60000 * 3, isStart: this.props.isShowEnterOtp }

  handleStartClick = (): void => {
    this.countdownApi && this.countdownApi.start()
  }

  handlePauseClick = (): void => {
    this.countdownApi && this.countdownApi.pause()
  }

  handleResetClick = (): void => {
    this.setState({ date: Date.now() + 60000 * 3 })
  }

  handleUpdate = (): void => {
    this.forceUpdate()
  }

  setRef = (countdown: Countdown | null): void => {
    if (countdown) {
      this.countdownApi = countdown.getApi()
    }
  }

  isPaused(): boolean {
    return !!(this.countdownApi && this.countdownApi.isPaused())
  }

  isCompleted(): boolean {
    return !!(this.countdownApi && this.countdownApi.isCompleted())
  }

  rendererCountdown({
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps): JSX.Element {
    if (completed) {
      // Render a completed state
      return <span></span>
    }
    // Render a countdown
    return (
      <span>
        {minutes}:{seconds}
      </span>
    )
  }

  componentDidUpdate() {
    if (this.props.isShowEnterOtp && !this.isCompleted()) {
      this.handleStartClick()
    } else if (this.props.isShowEnterOtp && this.isCompleted()) {
      this.props.setIsShowEnterOtp(false)
    }
  }

  render() {
    console.log(
      `🚀 ~ file: CountDown.tsx ~ line 75 ~ CountdownApiExample ~ render ~ this.isPaused()`,
      this.isPaused()
    )

    console.log(
      `🚀 ~ file: CountDown.tsx ~ line 79 ~ CountdownApiExample ~ render ~ this.isCompleted()`,
      this.isCompleted()
    )
    return (
      <>
        <Countdown
          key={this.state.date}
          ref={this.setRef}
          date={this.state.date}
          onMount={this.handleUpdate}
          onStart={this.handleUpdate}
          onPause={this.handleUpdate}
          onComplete={this.handleUpdate}
          autoStart={false}
          renderer={this.rendererCountdown}
        />
        {/* <div>
          <button
            type="button"
            onClick={this.handleStartClick}
            disabled={!this.isPaused() || this.isCompleted()}
          >
            Start
          </button>{' '}
          <button
            type="button"
            onClick={this.handlePauseClick}
            disabled={this.isPaused() || this.isCompleted()}
          >
            Pause
          </button>{' '}
          <button type="button" onClick={this.handleResetClick}>
            Reset
          </button>
        </div> */}
      </>
    )
  }
}

/* interface CountDownOtpProps {}

const CountDownOtp: FC<CountDownOtpProps> = (props: CountDownOtpProps) => {
  const {} = props

  const rendererCountdown = ({
    minutes,
    seconds,
    completed,
  }: CountdownRenderProps) => {
    if (completed) {
      // Render a completed state
      return <span>You are good to go!</span>
    }
    // Render a countdown
    return (
      <span>
        {minutes}:{seconds}
      </span>
    )
  }

  return (
    <React.Fragment>
      <Countdown
        date={Date.now() + 60000 * 3}
        intervalDelay={0}
        precision={3}
        renderer={rendererCountdown}
      />
    </React.Fragment>
  )
}

export default CountDownOtp */
