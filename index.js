class CalcApp extends React.Component {
    state = {
        firstVal: '',
        secondVal: '',
        operator: '',
        display: '0',
    }
  
    componentDidMount() {
        document.addEventListener('keyup', this.keypressHandler)
    }
  
    componentWillUnmount() {
        document.removeEventListener('keyup', this.keypressHandler)
    }
  
    keypressHandler = (ev) => {
        const { key } = ev
        const isNumber = /^[0-9.]$/.test(key)
        const isOperator = /^[-+*/]$/.test(key)
        const isDelete = /^Delete$/.test(key)
        const isEscape = /^Escape$/.test(key)
        const isEnter = /^Enter$/.test(key)
  
        if (isNumber) {
            this.setNumberValue(key)
        } else if (isOperator) {
            this.setOperatorValue(key)
        } else if (isDelete) {
            this.deleteChar()
        } else if (isEscape) {
            this.allClear()
        } else if (isEnter) {
            this.equalHandler()
        }
    }
  
    resetState = (resetAll) => {
        if (resetAll) {
            this.setState({
                firstVal: '',
                secondVal: '',
                operator: '',
                display: '0',
            })
        } else {
            this.setState({
                firstVal: '',
                secondVal: '',
                operator: '',
            })
        }
    }
  
    hasPoint = (value) => {
        return value.indexOf('.') > -1
    }
  
    setNumberValue = (value) => {
        const { firstVal, secondVal, operator } = this.state
        const currentVal = operator ? secondVal : firstVal
  
        if (value === '.' && this.hasPoint(currentVal)) {
            return
        }
  
        const newValue = currentVal === '0' ? value : currentVal + value
  
        if (!operator) {
            this.setState({ firstVal: newValue })
        } else {
            this.setState({ secondVal: newValue })
        }
  
        this.setDisplay(newValue)
    }
  
    getOverall = () => {
        const { firstVal, secondVal, operator } = this.state
        return `${firstVal} ${operator} ${secondVal}`
    }
  
    setDisplay = (value) => {
        this.setState({ display: value })
    }
  
    getCurrentTargetValue = () => {
        const { firstVal, secondVal, operator } = this.state
        return operator ? secondVal : firstVal
    }
  
    setOperatorValue = (operatorInput) => {
        const { firstVal, secondVal, operator, display } = this.state
  
        if (firstVal && !secondVal) {
            this.setState({ operator: operatorInput, display: firstVal })
        } else if (firstVal && operator && secondVal) {
            const total = this.calculate()
            this.setState({
                operator: operatorInput,
                firstVal: total.toString(),
                secondVal: '',
            })
            this.setDisplay(total.toString())
        } else {
            this.setState({ operator: operatorInput, firstVal: display })
        }
    }
  
    operatorClickHandler = (e) => {
        const operatorInput = e.target.innerHTML
        this.setOperatorValue(operatorInput)
    }
  
    allClear = () => {
        this.resetState(true)
    }
  
    deleteChar = () => {
        const { firstVal, secondVal, operator } = this.state
  
        if (!operator) {
            const newVal = firstVal.slice(0, -1)
            this.setState({ firstVal: newVal, display: newVal || '0' })
        } else if (operator && !secondVal) {
            this.setState({ display: firstVal, operator: '' })
        } else {
            const newVal = secondVal.slice(0, -1)
            this.setState({ secondVal: newVal, display: newVal || '0' })
        }
    }
  
    removeZeroAtStart = (value) => {
        return value.indexOf('0') === 0 ? value.substring(1) : value
    }
  
    fixNumberString = (value, finalize = false) => {
        if (finalize && value.indexOf('.') === value.length - 1 && value.length > 1) {
            return value + '0'
        }
  
        if (value.indexOf('0') === 0 && !value.indexOf('0.') === 0) {
            return value.substring(1)
        }
  
        if (value.indexOf('.') === 0 && value.length === 1) {
            return '0.'
        }
  
        return value
    }
  
    calculate = () => {
        const { firstVal, secondVal, operator } = this.state
        const vfirstVal = this.fixNumberString(firstVal, true)
        const vsecondVal = this.fixNumberString(secondVal, true)
  
        switch (operator) {
            case '-':
                return parseFloat(vfirstVal) - parseFloat(vsecondVal)
            case '*':
                return parseFloat(vfirstVal) * parseFloat(vsecondVal)
            case ':':
                return parseFloat(vfirstVal) / parseFloat(vsecondVal)
            case '+':
            default:
                return parseFloat(vfirstVal) + parseFloat(vsecondVal)
        }
    }
  
    equalHandler = () => {
        const { firstVal, secondVal, operator } = this.state
  
        if (firstVal && secondVal && operator) {
            const total = this.calculate()
            this.setDisplay(total.toString())
            this.resetState()
        }
    }
  
    render() {
        const { display, operator } = this.state
        const activeOperator = (name) => (operator === name ? 'active' : '')
  
        return (
            <div>
                <div className="display">
                    <p className="display-overall">{this.getOverall().trim()}</p>
                    <p className="display-text">{display}</p>
                </div>
                <div className="inputs">
                    <div className="column main">
                        <div className="operator">
                            <div className="row">
                                <button
                                    className={`operator ${activeOperator('+')}`}
                                    onClick={this.operatorClickHandler}
                                >
                                    +
                                </button>
                                <button
                                    className={`operator ${activeOperator('-')}`}
                                    onClick={this.operatorClickHandler}
                                >
                                    -
                                </button>
                                <button
                                    className={`operator ${activeOperator(':')}`}
                                    onClick={this.operatorClickHandler}
                                >
                                    :
                                </button>
                                <button
                                    className={`operator ${activeOperator('*')}`}
                                    onClick={this.operatorClickHandler}
                                >
                                    *
                                </button>
                            </div>
                        </div>
                        <div className="numbers">
                            <div className="row">
                                <button onClick={this.setNumberValue}>1</button>
                                <button onClick={this.setNumberValue}>2</button>
                                <button onClick={this.setNumberValue}>3</button>
                            </div>
                            <div className="row">
                                <button onClick={this.setNumberValue}>4</button>
                                <button onClick={this.setNumberValue}>5</button>
                                <button onClick={this.setNumberValue}>6</button>
                            </div>
                            <div className="row">
                                <button onClick={this.setNumberValue}>7</button>
                                <button onClick={this.setNumberValue}>8</button>
                                <button onClick={this.setNumberValue}>9</button>
                            </div>
                            <div className="row">
                                <button onClick={this.setNumberValue}>.</button>
                                <button onClick={this.setNumberValue}>0</button>
                                <button onClick={this.deleteChar}>C</button>
                            </div>
                        </div>
                    </div>
                    <div className="column sides">
                        <button className="ac" onClick={this.allClear}>
                            AC
                        </button>
                        <button className="equal" onClick={this.equalHandler}>
                            =
                        </button>
                    </div>
                </div>
            </div>
        )
    }
}
  
ReactDOM.render(<CalcApp />, document.getElementById('root'))