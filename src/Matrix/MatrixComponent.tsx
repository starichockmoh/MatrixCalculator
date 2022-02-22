import React, {ChangeEvent, useEffect, useState} from "react"
import styles from "./Matrix.module.css"
import {Alert, Button, Dropdown, Input, InputNumber, Menu, notification, PageHeader} from "antd"
import {CloseCircleOutlined, DownOutlined} from "@ant-design/icons"
import {Determinant, MultiplyMatrix, Scalar, SumMatrix, TransMatrix, Vector} from "./MatrixBackend"
import {useDispatch, useSelector} from "react-redux";
import {MatrixActions, MatrixStateType} from "./MatrixState";


type OperationType = "Addition" | "Multiplication" | "Transposition" | "Determinant" | "Scalar" | "Vector product"

const openNotification = (message: string) => {
    notification.open({
        message: 'Error was occurred',
        description: <Alert message={message} type="error" showIcon/>
    });
};


const InputComponent: React.FC<{ id: string }> = ({id}) => {
    const dispatch = useDispatch()
    const [Input_value, Set_input_value] = useState<string>("")
    const isClear = useSelector((state: MatrixStateType) => state.Matrix.isClear)
    const [wasError, Set_Error] = useState(false)


    const OnChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (isNaN(Number(e.currentTarget.value))) {
            dispatch(MatrixActions.wasError(true))
            Set_Error(true)
            setTimeout(() => Set_Error(false), 3000)
            setTimeout(() => dispatch(MatrixActions.wasError(false)), 3000)
        } else {
            wasError && Set_Error(false)
            Set_input_value(e.currentTarget.value)
        }
        !isClear && dispatch(MatrixActions.isClear(true))

    }
    return <>
        <Input id={id} className={styles.InputNumber} style={{borderColor: wasError ? "red" : undefined}}
               onChange={OnChange} value={Input_value}/>
    </>
}


export const Matrix: React.FC = () => {
    const dispatch = useDispatch()
    const [visible, Set_visible] = useState(false)
    const [result, Set_result] = useState<null | Array<Array<number>>>(null)
    const [currentOperation, Set_operation] = useState<OperationType>("Addition")
    const isClear = useSelector((state: MatrixStateType) => state.Matrix.isClear)
    const wasError = useSelector((state: MatrixStateType) => state.Matrix.wasError)
    const A_Size = useSelector((state: MatrixStateType) => state.Matrix.Matrix_A_Size)
    const B_Size = useSelector((state: MatrixStateType) => state.Matrix.Matrix_B_Size)

    useEffect(() => {
        if (isClear) {
            Set_result(null)
        }
    }, [isClear])

    const handleMenuClick = (e: any) => {
        if (e.key === '7') {
            Set_visible(false)
        }
    }
    const handleVisibleChange = (flag: boolean) => {
        Set_visible(flag)
    }

    const changeOperation = (operation: OperationType) => {
        Set_result(null)
        Set_operation(operation)
    }

    const menu = (
        <Menu onClick={handleMenuClick}>
            <Menu.Item key="1" onClick={() => changeOperation("Addition")}>
                Matrix addition
            </Menu.Item>
            <Menu.Item key="2" onClick={() => changeOperation("Multiplication")}>
                Matrix multiplication
            </Menu.Item>
            <Menu.Item key="3" onClick={() => changeOperation("Transposition")}>
                Matrix transposition
            </Menu.Item>
            <Menu.Item key="4" onClick={() => changeOperation("Determinant")}>
                Matrix determinant
            </Menu.Item>
            <Menu.Item key="5" onClick={() => changeOperation("Scalar")}>
                Scalar product
            </Menu.Item>
            <Menu.Item key="6" onClick={() => changeOperation("Vector product")}>
                Vector product
            </Menu.Item>
            <Menu.Item key="7">
                Close <span style={{marginLeft: "60%"}}><CloseCircleOutlined/></span>
            </Menu.Item>
        </Menu>
    );

    const MatrixArrayA = [] as Array<Array<number>>
    const MatrixArrayB = [] as Array<Array<number>>


    const GetMatrixValues = (Matrix: "A" | "B") => {
        const NewMatrix = [] as Array<Array<number>>
        const i_count = Matrix === "A" ? A_Size[0] : B_Size[0]
        const j_count = Matrix === "A" ? A_Size[1] : B_Size[1]
        for (let i = 0; i < i_count; ++i) {
            NewMatrix.push([])
            for (let j = 0; j < j_count; ++j) {
                let idStr = Matrix + ":" + String((i + 1) * 10 + (j + 1))
                let elem = document.getElementById(idStr)
                // @ts-ignore
                NewMatrix[i].push(Number(elem.value))
            }
        }
        return NewMatrix
    }

    for (let i = 0; i < A_Size[0]; ++i) {
        MatrixArrayA.push([])
        for (let j = 0; j < A_Size[1]; ++j) {
            MatrixArrayA[i].push(0)
        }
    }

    for (let i = 0; i < B_Size[0]; ++i) {
        MatrixArrayB.push([])
        for (let j = 0; j < B_Size[1]; ++j) {
            MatrixArrayB[i].push(0)
        }
    }

    const GetValues = () => {
        Set_result(null)
        const MatrixA = GetMatrixValues("A")
        switch (currentOperation) {
            case "Addition": {
                if (A_Size[0] === B_Size[0] && A_Size[1] === B_Size[1]) {
                    const MatrixB = GetMatrixValues("B")
                    Set_result(SumMatrix(MatrixB, MatrixA))
                } else {
                    openNotification("To add two matrix their size must be same!")
                }
                break
            }
            case "Determinant": {
                if ( A_Size[0] === A_Size[1]) {
                    const DetArray = [[Determinant(MatrixA)]]
                    Set_result(DetArray)
                } else {
                    openNotification("To calculate the determinant matrix size must be square!")
                }
                break
            }
            case "Multiplication": {
                if (A_Size[1] === B_Size[0]) {
                    const MatrixB = GetMatrixValues("B")
                    Set_result(MultiplyMatrix(MatrixA, MatrixB))
                } else {
                    openNotification("To multiply two matrix the number of columns of the first matrix must be " +
                        "equal to the number of rows of the second matrix!")
                }
                break
            }
            case "Transposition": {
                Set_result(TransMatrix(MatrixA))
                break
            }
            case "Scalar": {
                if (A_Size[1] === B_Size[1] && A_Size[0] === 1 && B_Size[0] === 1) {
                    const MatrixB = GetMatrixValues("B")
                    const scalar = [[Scalar(MatrixA[0], MatrixB[0])]]
                    Set_result(scalar)
                } else {
                    openNotification("Input two vectors with same size!")
                }
                break
            }
            case "Vector product": {
                if (A_Size[0] === 1 && B_Size[0] === 1 && A_Size[1] === 3 && B_Size[1] === 3) {
                    const MatrixB = GetMatrixValues("B")
                    const vector = [Vector(MatrixA[0], MatrixB[0])]
                    Set_result(vector)
                } else {
                    openNotification("Input two vectors with same size!")
                }
                break
            }
        }
        dispatch(MatrixActions.isClear(false))
    }

    const OnChangeSize = (name: "A" | "B", position: "c" | "r", value: number) => {
        result && Set_result(null)
        if (name === "A") {
            let currentSize = [...A_Size]
            if (position === "r") {
                currentSize[0] = value
            } else {
                currentSize[1] = value
            }
            dispatch(MatrixActions.setMatrixSize("A", currentSize))
        } else {
            let currentSize = [...B_Size]
            if (position === "r") {
                currentSize[0] = value
            } else {
                currentSize[1] = value
            }
            dispatch(MatrixActions.setMatrixSize("B", currentSize))
        }
    }


    return <>
        <PageHeader title={"Matrix calculator online"} subTitle={"(offline)"} className={styles.Header}/>
        {wasError && openNotification('Error: Please, input numbers instead words!')}
        <div className={styles.Container}>
            <Dropdown overlay={menu} trigger={["click"]}
                      onVisibleChange={handleVisibleChange}
                      visible={visible}>
                <Button type={"link"}>
                    {currentOperation} <DownOutlined/>
                </Button>
            </Dropdown>
            Choose matrix size: &nbsp;
            Matrix A &nbsp;
            <InputNumber min={1} max={5} defaultValue={2} className={styles.InputSize}
                         onChange={(value: number) => OnChangeSize("A", "r", value)}/>
            &nbsp;x&nbsp;
            <InputNumber min={1} max={5} defaultValue={2} className={styles.InputSize}
                         onChange={(value: number) => OnChangeSize("A", "c", value)}/>


            {(currentOperation !== "Transposition" && currentOperation !== "Determinant") &&
            <>&nbsp; Matrix B &nbsp;
                <InputNumber min={1} max={5} defaultValue={2} className={styles.InputSize}
                             onChange={(value: number) => OnChangeSize("B", "r", value)}/>
                &nbsp;x&nbsp;
                <InputNumber min={1} max={5} defaultValue={2} className={styles.InputSize}
                             onChange={(value: number) => OnChangeSize("B", "c", value)}/>
            </>}
            <div className={styles.CalcContainer}>
                <div className={currentOperation === "Determinant" ? styles.MatrixDet : undefined}>
                    {MatrixArrayA.map((line, index) => {
                        return <div key={index} className={styles.MatrixLine}>
                            {MatrixArrayA[index].map((n, i) =>
                                <InputComponent id={"A:" + String((index + 1) * 10 + i + 1)}
                                                key={(index + 1) * 10 + i + 1}/>
                            )}

                        </div>
                    })}
                </div>
                {currentOperation === "Addition" ?
                    <div>+</div> : currentOperation === "Transposition" ?
                        <div>T</div> : currentOperation !== "Determinant" ?
                            <div>*</div> : null }
                {(currentOperation !== "Transposition" && currentOperation !== "Determinant") &&
                <div>
                    {
                        MatrixArrayB.map((line, index) => {
                            return <div key={index} className={styles.MatrixLine}>
                                {MatrixArrayB[index].map((n, i) =>
                                    <InputComponent id={"B:" + String((index + 1) * 10 + i + 1)}
                                                    key={(index + 1) * 10 + i + 1}/>
                                )}
                            </div>
                        })}
                </div>
                }
                {result && <div>
                    =
                </div>}
                {result && <div>
                    {result.map((line, index) => {
                        return <div key={index}>
                            {result[index].map((n, i) => <Input key={(index + 1) * 10 + i + 1}
                                                                className={styles.InputNumber}
                                                                value={result[index][i]}/>
                            )}
                        </div>
                    })}
                </div>}
            </div>
            <Button className={styles.CalcButton} type={"primary"} onClick={GetValues}>
                Сalculate
            </Button>
        </div>
    </>
}