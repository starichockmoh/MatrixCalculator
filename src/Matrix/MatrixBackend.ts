type MatrixType = Array<Array<number>>


export function TransMatrix(A: MatrixType) {      //На входе двумерный массив
    const m = A.length, n = A[0].length, AT = [] as Array<Array<number>> //считали строки и столбцы
    for (let i = 0; i < n; i++) { //в цикле идем по строке
        AT[i] = []
        for (let j = 0; j < m; j++) AT[i][j] = A[j][i]
    }
    return AT
}


export function SumMatrix(A: MatrixType, B: MatrixType) {   //На входе двумерные массивы одинаковой размерности
    const m = A.length, n = A[0].length, C = [] as MatrixType //считали строки и столбцы
    for (let i = 0; i < m; i++) { //в цикле идем по строке
        C[i] = [] // формируем сумму
        for (let j = 0; j < n; j++)
            C[i][j] = A[i][j] + B[i][j]
    }
    return C;
}


export function MultiplyMatrix(A: MatrixType, B: MatrixType) {
    const rowsA = A.length,  //считали строки и столбцы
        rowsB = B.length, colsB = B[0].length,
        C = [] as MatrixType
    for (let i = 0; i < rowsA; i++) //создали новый пустой массив
        C[i] = []
    for (let k = 0; k < colsB; k++) { //идем по каждой строке и перемножаем ее со столбцами
        for (let i = 0; i < rowsA; i++) {
            let t = 0
            for (let j = 0; j < rowsB; j++)
                t += A[i][j] * B[j][k]
            C[i][k] = t
        }
    }
    return C
}


export function Determinant(A: MatrixType) {   // Используется алгоритм Барейса, сложность O(n^3)
    const N = A.length, B = [] as MatrixType //считали кол-во строк
    let exchanges = 0 , denom = 1
    for (let i = 0; i < N; ++i) { //идем по строкам в цикле
        B[i] = []
        for (let j = 0; j < N; ++j)
            B[i][j] = A[i][j]
    }
    for (let i = 0; i < N-1; ++i) {//идем по строкам в цикле
        let maxN = i, maxValue = Math.abs(B[ i ][ i ])
        for (let j = i+1; j < N; ++j) {
            let value = Math.abs(B[j][ i ])
            if (value > maxValue){
                maxN = j
                maxValue = value
            }
        }
        if (maxN > i) {
            let temp = B[ i ]; B[ i ] = B[maxN]; B[maxN] = temp
            ++exchanges
        }
        else {
            if (maxValue === 0)
                return maxValue;
        }
        let value1 = B[i][i];
        for (let j = i+1; j < N; ++j) {
            let value2 = B[j][i];
            B[j][i] = 0;
            for (let k = i + 1; k < N; ++k)
                B[j][k] = (B[j][k] * value1 - B[i][k] * value2) / denom;
        }
        denom = value1;
    }
    if (exchanges % 2) return -B[N-1][N-1]; //при кратности 2 возвращаем с минусом
    else return B[N-1][N-1];
}


export function Scalar(A: Array<number>, B: Array<number>) {
    let scalar = 0 //будущее скалярное произведение
    for (let i = 0; i < A.length; ++i) { //идём по циклу и перемножаем соотв координаты
        scalar += A[i] * B[i]
    }
    return scalar
}


export function Vector(A: Array<number>, B: Array<number>) {
    const det = (a: number,b: number,c: number,d:number) => { //функция для подсчета определителя
        return a*d - b*c
    }
    return [det(A[1], A[2], B[1], B[2]), -det(A[0], A[2], B[0], B[2]), det(A[0], A[1], B[0], B[1])]
}