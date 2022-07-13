/* eslint-disable class-methods-use-this */

class SDKNativeUtils {
  loadConfigSuccess(type, url) {
    const message = {
      type: 'LOAD_CONFIG_SUCCESS',
      data: {
        src: url || '',
        type: '',
        source: [],
      },
    }

    this.callToNative(message)
  }

  requestScanCode() {
    /* const message = {
      type: 'SCAN_QRCODE',
      data: {
        data: '',
      },
    } */
    const message = { name: 'SCAN_QRCODE', range: [2, 3, 4, 5] }
    this.callToNative(message)
  }

  callToNative(message) {
    if (message == null || message == undefined) return
    if (window.Android) {
      // @ts-ignore
      window.Android.postMessage(JSON.stringify(message))
    }

    // @ts-ignore
    if (window.webkit && window.webkit.messageHandlers.IOS) {
      // @ts-ignore
      window.webkit.messageHandlers.IOS.postMessage(JSON.stringify(message))
    }
    if (window.parent) {
      console.log('=======App Web')
      window.parent.postMessage(JSON.stringify(message), '*')
    }
  }

  setLocalStorage(key, value) {
    const message = {
      type: 'SET_DB',
      data: {
        key: key,
        value: value,
      },
    }

    if (window.parent) {
      window.parent.postMessage(JSON.stringify(message), '*')
    }
  }

  getLocalStorage(key) {
    const message = {
      type: 'GET_DB',
      data: {
        key: key,
      },
    }

    if (window.parent) {
      window.parent.postMessage(JSON.stringify(message), '*')
    }
  }

  embedCallback(callback) {
    let key = window['addEventListener'] ? 'addEventListener' : 'attachEvent'
    let add = window[key]
    // let selectionMethod = key === 'attachEvent' ? 'onmessage' : 'message'
    add('okmessage', function (data) {
      let result
      try {
        result = JSON.parse(data['data'])
      } catch (error) {
        result = data
      }
      callback(result)
      /* if (result['type'] === 'TRANSACTION_ID_SCAN') {
        callback(result)
      } else {
        if (result['type'] === 'SET_DB' && result.data) {
          localStorage.setItem(
            result.data.key,
            JSON.stringify(result.data.value)
          )
        } else {
          if (result['type'] === 'GET_DB') {
            let logResultsMsg = {
              type: 'GET_DB',
              data: {
                value: localStorage.getItem(result.data.key),
              },
            }
            this.callToEmbed(logResultsMsg)
          }
        }
      } */
    })
  }

  callToEmbed(data) {
    if (document.getElementById('iframe')) {
      let typeEditors = document.getElementById('iframe').contentWindow
      typeEditors.postMessage(JSON.stringify(data), '*')
    }
  }
}

export const sdkNativeUtils = new SDKNativeUtils()
