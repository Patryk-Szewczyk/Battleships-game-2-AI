// Battleships 2
// Jest to gra w statki ze sztuczną inteligencją (AI).
// Zasady gry znajdują się bezpośrednio w grze.
// UWAGA! Kod jest zastrzeżony prawami autorskimi. W celu skorzystania z ów kodu
// należy skontaktować się z jego twórcą: Patryk Szewczyk | AHNS 1/INF | 2023



// Page box:
const page_Obj: {
    pageEL: HTMLDivElement,
    setPageHeight: Function
} = {
    pageEL: document.querySelector('div.page'),
    setPageHeight(): void {
        ['load', 'resize'].forEach((ev) => {
            window.addEventListener(ev, () => {
                let hgt: string = String(window.innerHeight);
                this.pageEL.style.height = hgt + 'px';
            }, false);
        });
    }
};
page_Obj.setPageHeight();



// Plansze:
const boards_Obj: {
    boardELS: NodeListOf<HTMLDivElement>,
    boardType: string[],
    setAreaELS: Function,
    setBoardCorT: Function,
    setBoardCorL: Function
} = {
    boardELS: document.querySelectorAll('div.board-prp'),
    boardType: ['U', 'C'],
    // Pola planszy:
    setAreaELS(): void {
       for (let i: number = 0; i < 2; i++) {
             for (let j: number = 0; j < 100; j++) {
                let areaEL = document.createElement('div');
                areaEL.setAttribute('class', 'area-box');
                areaEL.setAttribute('id', this.boardType[i] + String(j));
                this.boardELS[i].appendChild(areaEL);
            }
        };
        this.setBoardCorT();
    },
    // Współrzędne numberowe:
    setBoardCorT(): void {
        let boardCorT_AR: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.board-cor-T');
        for (let i: number = 0; i < 2; i++) {
            for (let j: number = 0; j < 10; j++) {
                let boardChildEL = document.createElement('div');
                boardChildEL.setAttribute('class', 'bc-T-child');
                let boardChildTN = document.createTextNode(String(j));
                boardChildEL.appendChild(boardChildTN);
                boardCorT_AR[i].appendChild(boardChildEL);
            }
        };
        this.setBoardCorL();
    },
    // Współrzędne stringowe:
    setBoardCorL(): void {
        let boardCorC_AR: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.board-cor-L');
        let boardCorC_Ltr: string[] = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
        for (let i: number = 0; i < 2; i++) {
            for (let j: number = 0; j < 10; j++) {
                let boardChildEL = document.createElement('div');
                boardChildEL.setAttribute('class', 'bc-L-child');
                let boardChildTN = document.createTextNode(boardCorC_Ltr[j]);
                boardChildEL.appendChild(boardChildTN);
                boardCorC_AR[i].appendChild(boardChildEL);
            }
        };
    }
};
boards_Obj.setAreaELS();



// Niebezpieczne pola:
const dangerousFields_Obj: {
    dir_B: number[][],
    dir_R: number[][],
    setToBtmAR: Function,
    setToRgtAR: Function,
    updateARS: Function
} = {
    dir_B: [[], [], [], []],   // B2, B3, B4, B5
    dir_R: [[], [], [], []],   // R2, R3, R4, R5
    setToBtmAR(): void {
        let startToIncValue: number = 89;
        for (let i: number = 0; i < 4; i++) {
            let ship_Value: number = 0;
            ship_Value = startToIncValue;
            for (let j = 0; j < 10; j++) {
                this.dir_B[i][j] = ship_Value += 1;
            };
            startToIncValue -= 10;
        };
        dangerousFields_Obj.setToRgtAR();
    },
    setToRgtAR(): void {
        let decrement = -1;
        // Wypełnainie tablicy pól w prawym kierunku:
        for (let i = 0; i < 4; i++) {
            let ship_Value = 0;
            ship_Value = decrement;
            for (let j = 0; j < 10; j++) {
                this.dir_R[i][j] = ship_Value += 10;
            };
            decrement -= 1;
        };
        // Wypełnainie tablicy pól w dolnym kierunku:
        let new_R_Val_Array = [];
        for (let i = 1; i < this.dir_R.length; i++) {
            if (i <= 4) {
                new_R_Val_Array.push(this.dir_R[i - 1]);
            } else {
                break;
            }
        };
        dangerousFields_Obj.updateARS();
    },
    updateARS(): void {
        // Tworzenie tablicy kolona - dół:
        let new_B_Val_Array = [];
        for (let i = 1; i < this.dir_B.length; i++) {
            if (i <= 4) {
                new_B_Val_Array.push(this.dir_B[i - 1]);
            } else {
                break;
            }
        };
        // Tworzenie tablicy kolona - prawo:
        let new_R_Val_Array = [];
        for (let i = 1; i < this.dir_R.length; i++) {
            if (i <= 4) {
                new_R_Val_Array.push(this.dir_R[i - 1]);
            } else {
                break;
            }
        };
        // Aktualizowanie tabliy klona - prawo:
        new_R_Val_Array[0] = this.dir_R[1].concat(this.dir_R[0]);
        new_R_Val_Array[1] = this.dir_R[2].concat(this.dir_R[0], this.dir_R[1]);
        new_R_Val_Array[2] = this.dir_R[3].concat(this.dir_R[0], this.dir_R[1], this.dir_R[2]);
        for (let i = 1; i < this.dir_R.length; i++) {
            this.dir_R[i] = new_R_Val_Array[i - 1];
        };
        for (let i = 0; i < this.dir_R.length; i++) {
            this.dir_R[i].sort((a, b) => {
                return a - b;
            });
        };
        // Aktualizowanie tabliy klona - dół:
        new_B_Val_Array[0] = this.dir_B[1].concat(this.dir_B[0]);
        new_B_Val_Array[1] = this.dir_B[2].concat(this.dir_B[0], this.dir_B[1]);
        new_B_Val_Array[2] = this.dir_B[3].concat(this.dir_B[0], this.dir_B[1], this.dir_B[2]);
        for (let i = 1; i < this.dir_B.length; i++) {
            this.dir_B[i] = new_B_Val_Array[i - 1];
        };
        for (let i = 0; i < this.dir_B.length; i++) {
            this.dir_B[i].sort((a, b) => {
                return a - b;
            });
        };
        console.log(this.dir_R);
        console.log(this.dir_B);
    }
};
dangerousFields_Obj.setToBtmAR();



const fieldsPosition_Obj: {
    fieldsPosARS: number[];   //{[index: string]: number[]}
    getFieldsPos: Function
} = {
    fieldsPosARS: [],   //{}
    getFieldsPos(): void {
        // Pobranie dzieci "pól" z planszy użytkownaika":
        const board: any = document.querySelectorAll('div.board-prp')[0];
        const onceBoardChilred: HTMLCollection = board.children;
        const boardsWithELS: any[] = [];
        for (let i: number = 1; i < board.childElementCount; i++) {
            boardsWithELS[i - 1] = onceBoardChilred[i];
        };
        //console.log(boardsWithELS);
        // - - - - - - - - - - - - - - - - - - - - - - -
        // Pobranie dzieci "pól" poszczególnych planszy
        /*const boards: NodeListOf<HTMLDivElement> = document.querySelectorAll('div.board-prp');
        const onceBoardChilred: any[] = [];
        const boardsWithELS: any[][] = [[]];
        for (let i: number = 0; i < 2; i++) {
            onceBoardChilred[i] = boards[i].children;
            boardsWithELS[i] = [];
            for (let j: number = 0; j < 100; j++) {
                boardsWithELS[i][j] = onceBoardChilred[i][j];
            };
        };
        boardsWithELS[0].shift();
        console.log(boardsWithELS);*/
        // - - - - - - - - - - - - - - - - - - - - - - -
        // Pobranie współrzędnych poszczególnych dzieci "pól" poszczególnych plansz:
        const areasCorAR: number[][] = [[]];
        for (let i: number = 0; i < boardsWithELS.length; i++) {
            let rectOBJ: {[index: string]: number} = boardsWithELS[i].getBoundingClientRect();
            areasCorAR[i] = [];
            areasCorAR[i][0] = rectOBJ.top;
            areasCorAR[i][1] = rectOBJ.bottom;
            areasCorAR[i][2] = rectOBJ.left;
            areasCorAR[i][3] = rectOBJ.right;
            this.fieldsPosARS[i] = areasCorAR[i];
        };
        //console.log(areasCorAR);
        //console.log(this.fieldsPosARS);
    }
};
fieldsPosition_Obj.getFieldsPos();



// Użytkownik - akcje:
const userChooseShipCor: {
    fullAreasBoardAR: number[],
    fillFullAreasBoardAR: Function,
    userShipsAR: UserShipCor[],
    onceShipArgs: (string | number)[],
    addUserShip_AEL: Function,
    submitBut: HTMLInputElement,
    /*shipLgt: HTMLInputElement,
    shipDir: HTMLInputElement,*/
    //shipStartCor: HTMLInputElement,
    createLimit: number,
    selectShip_AEL: Function,
    rotateShip_AEL: Function,
    pointSwt: string,
    createAvailableFields: Function,
    moveShip_AEL: Function,
    mousemove_AEL: Function,
    placeShipSwitch: boolean,
    mouseXcor: number,
    mouseYcor: number,
    shpPlcPtBCR: number[],
    availableFields: number[],
    setShip_AEL: Function
} = {
    fullAreasBoardAR: [],
    userShipsAR: [],
    onceShipArgs: [3, 'B'],   // [3, 'B', 42]
    submitBut: document.querySelector('div.im-submit'),
    /*shipLgt: document.querySelector('input.inpLgt'),
    shipDir: document.querySelector('input.inpDir'),*/
    //shipStartCor: document.querySelector('input.inpCor'),
    createLimit: 0,
    pointSwt: 'top',
    placeShipSwitch: true,
    mouseXcor: 0,
    mouseYcor: 0,
    shpPlcPtBCR: [],
    availableFields: [],
    fillFullAreasBoardAR(): void {
        for (let i: number = 0; i < 100; i++) {
            this.fullAreasBoardAR[i] = i;
        }
    },
    addUserShip_AEL(arg_1):void {
        ['click', 'touchend'].forEach((ev) => {
            this.submitBut.addEventListener(ev, () => {
                if (this.createLimit < 7) {
                    this.createLimit += 1;
                    let num: number = this.createLimit;
                    let lgt: number = this.shipLgt.value;   //this.shipLgt.value
                    let dir: string = this.shipDir.value;   //this.shipDir.value
                    let cor: number = arg_1;   //this.shipStartCor.value
                    let ship: UserShipCor = new UserShipCor(num, lgt, dir, cor);
                    this.userShipsAR.push(ship);
                    console.log(this.createLimit);
                } else {}
                if (this.createLimit === 7) {
                    console.log(this.userShipsAR);
                } else {}
            }, false);
        });
    },
    selectShip_AEL():void {
        const selectEL: HTMLSelectElement = document.querySelector('select.im-select-ship');
        selectEL.addEventListener('change', (e) => {
            const el: any = e.currentTarget;
            let lgt: number = el.value;
            this.onceShipArgs[0] = lgt;
            let shipPlaceEL: any = document.getElementById('im-ship-place-element');
            let shipGlobalEL: any = document.getElementById('im-ship-global-element');
            shipPlaceEL.removeAttribute('class');
            shipGlobalEL.removeAttribute('class');
            shipPlaceEL.setAttribute('class', 'im-ship-S' + lgt);
            shipGlobalEL.setAttribute('class', 'im-ship-S' + lgt);
            console.log(shipPlaceEL);
            //console.log(this.onceShipArgs);
            this.createAvailableFields();
        }, false);
        this.rotateShip_AEL();
    },
    rotateShip_AEL(): void {
        const rotateLocalEL: HTMLDivElement = document.querySelector('div.im-rotate-ship');
        const rotateGlobalEL: any = document.getElementById('im-ship-global-element');
        const shipHanger: HTMLDivElement = document.querySelector('div.im-ship-place');
        let deg: number = 0;
        let dirSwitch: number = 0;
        let dir: string = 'B';
        //let pointSwt: string = 'top';
        ['click', 'touchend'].forEach((ev) => {
            rotateLocalEL.addEventListener(ev, () => {
                // Słicz kierunkowy:
                deg += 90;
                rotateLocalEL.style.transform = 'rotate(' + deg + 'deg)';
                rotateLocalEL.style.transitionDuration = '0.5s';
                rotateGlobalEL.style.transform = 'rotate(' + deg + 'deg)';
                rotateGlobalEL.style.transitionDuration = '0.5s';
                shipHanger.style.transform = 'rotate(' + deg + 'deg)';
                shipHanger.style.transitionDuration = '0.5s';
                if (dirSwitch === 0) {
                    dirSwitch += 1;
                    dir = 'R';
                } else if (dirSwitch === 1) {
                    dirSwitch -= 1;
                    dir = 'B';
                }
                this.onceShipArgs[1] = dir;
                this.createAvailableFields();
                console.log(this.availableFields);
                console.log(this.onceShipArgs);
                // Ustawianie punktora:
                const point: any = document.getElementById('im-ship-place-point');
                if (this.pointSwt === 'top') {
                    this.pointSwt = 'right'
                    point.style.bottom = '0px';
                    point.style.top = 'auto';
                } else if (this.pointSwt === 'right') {
                    this.pointSwt = 'bottom'
                    point.style.bottom = '0px';
                    point.style.top = 'auto';
                } else if (this.pointSwt === 'bottom') {
                    this.pointSwt = 'left';
                    point.style.bottom = '0px !important';
                    point.style.top = '0px';
                } else if (this.pointSwt === 'left') {
                    this.pointSwt = 'top';
                    point.style.bottom = '0px !important';
                    point.style.top = '0px';
                }
            }, false);
        });
        this.moveShip_AEL();
    },
    createAvailableFields(): void {
        // Dostępne pola:
        let avlFldIdx: number = this.onceShipArgs[0] - 2;
        let selectedTable_dir_B: number[] = dangerousFields_Obj.dir_B[avlFldIdx];
        let selectedTable_dir_R: number[] = dangerousFields_Obj.dir_R[avlFldIdx];
        let newArr: number[] = [];
        // Tworzenie nowej tablicy:
        for (let i: number = 0; i < 100; i++) {
            newArr[i] = i;
        };
        // Czy wartość inputa "select" nie jest równa: "nie wybrano":
        if (this.onceShipArgs[0] !== 'nie wybrano') {
            // Kasowanie niedozwolonych indeksów w nowo-utworzonej tablicy, w zależności
            // od długości statku i jego położenia:
            if (this.onceShipArgs[1] === 'B') {
                for (let i: number = 0; i < 100; i++) {
                    for (let j: number = 0; j < selectedTable_dir_B.length; j++) {
                        if (newArr[i] == selectedTable_dir_B[j]) {
                            let elLoc: number = newArr.indexOf(selectedTable_dir_B[j]);
                            newArr.splice(elLoc, 1);
                        } else {}
                    };
                };
            } else if (this.onceShipArgs[1] === 'R') {
                for (let i: number = 0; i < 100; i++) {
                    for (let j: number = 0; j < selectedTable_dir_R.length; j++) {
                        if (newArr[i] == selectedTable_dir_R[j]) {
                            let elLoc: number = newArr.indexOf(selectedTable_dir_R[j]);
                            newArr.splice(elLoc, 1);
                        } else {}
                    };
                };
            }
        } else {}
        this.availableFields = newArr;
        console.log(this.availableFields);    /*ARRAY_FIELDS CONSOLLOG*/
    },
    moveShip_AEL(): void {
        const place: HTMLDivElement = document.querySelector('div.im-ship-place');
        ['click', 'touchend'].forEach((ev) => {
            place.addEventListener(ev, () => {
                if (this.placeShipSwitch === true) {
                    this.placeShipSwitch = false;
                    const shipLocalEL: any = document.getElementById('im-ship-place-element');
                    shipLocalEL.style.display = 'none';
                    const shipGlobalEL: any = document.getElementById('im-ship-global-element');
                    shipGlobalEL.style.display = 'flex';   // MEGA WAŻNE!
                    let shipELDim: any = shipGlobalEL.getBoundingClientRect();
                    let shipELDim_wdt = shipELDim.width;
                    let shipELDim_hgt = shipELDim.height;
                    //document.getElementById('clientShow').textContent = this.mouseXcor + ' | ' + this.mouseYcor;
                    if (this.pointSwt === 'top' || this.pointSwt === 'bottom') {
                        this.mouseXcor = this.mouseXcor - (shipELDim_wdt / 2);
                        this.mouseYcor = this.mouseYcor - (shipELDim_hgt / 2);
                    } else if (this.pointSwt === 'right' || this.pointSwt === 'left') {
                        this.mouseXcor = this.mouseXcor - (shipELDim_hgt / 2);
                        this.mouseYcor = this.mouseYcor - (shipELDim_wdt / 2);
                    }
                    shipGlobalEL.style.left = this.mouseXcor + 'px';
                    shipGlobalEL.style.top = this.mouseYcor + 'px';
                    shipGlobalEL.style.transitionDuration = '0.0s';
                } else {}
            }, false);
        });
    },
    mousemove_AEL() {
        window.document.addEventListener('mousemove', (e) => {
            console.log(this.placeShipSwitch);
            // Pseudo-ruszanie statkiem:
            this.mouseXcor = e.clientX;
            this.mouseYcor = e.clientY;
            const shipEL: any = document.getElementById('im-ship-global-element');
            let shipELDim: any = shipEL.getBoundingClientRect();
            let shipELDim_wdt = shipELDim.width;
            let shipELDim_hgt = shipELDim.height;
            //document.getElementById('clientShow').textContent = this.mouseXcor + ' | ' + this.mouseYcor;
            if (this.pointSwt === 'top' || this.pointSwt === 'bottom') {
                this.mouseXcor = this.mouseXcor - (shipELDim_wdt / 2);
                this.mouseYcor = this.mouseYcor - (shipELDim_hgt / 2);
            } else if (this.pointSwt === 'right' || this.pointSwt === 'left') {
                this.mouseXcor = this.mouseXcor - (shipELDim_hgt / 2);
                this.mouseYcor = this.mouseYcor - (shipELDim_wdt / 2);
            }
            shipEL.style.left = this.mouseXcor + 'px';
            shipEL.style.top = this.mouseYcor + 'px';
            shipEL.style.transitionDuration = '0.0s';
            // Współżędne punktu początkowego położenia statku:
            const shipPlacePoint: any = document.getElementById('im-ship-place-point');
            this.shpPlcPtBCR = shipPlacePoint.getBoundingClientRect();
            let shpPlcPt_X = this.shpPlcPtBCR.x;
            let shpPlcPt_y = this.shpPlcPtBCR.y;
            //document.getElementById('clientShow').innerHTML = 'Pointer: x: ' + shpPlcPt_X + ' | y: ' + shpPlcPt_y;
        }, false);
    },
    setShip_AEL(): void {   // W PRODUKCJI: pełne skupienie
        ['click', 'touchstart'].forEach((ev) => {
            window.addEventListener(ev, () => {
                const userBoardEL = document.querySelectorAll('div.board-prp')[0];
                const userBoardEL_RECT: any = userBoardEL.getBoundingClientRect();
                let usrBrd_Top = userBoardEL_RECT.top;
                let usrBrd_Bottom = userBoardEL_RECT.bottom;
                let usrBrd_Left = userBoardEL_RECT.left;
                let usrBrd_Right = userBoardEL_RECT.right;
                let plcPnt_X = this.shpPlcPtBCR.x;
                let plcPnt_Y = this.shpPlcPtBCR.y;
                //console.log(`usr_Top: ${usrBrd_Top} | usr_Bottom: ${usrBrd_Bottom} | usr_Left: ${usrBrd_Left} | usr_Right ${usrBrd_Right} | plc_X ${plcPnt_X} | plc_Y: ${plcPnt_Y}`);
                if ((plcPnt_X > usrBrd_Left && plcPnt_X < usrBrd_Right) && (plcPnt_Y > usrBrd_Top && plcPnt_Y < usrBrd_Bottom)) {
                    let direction: string = this.onceShipArgs[1];
                    for (let i: number = 0; i < fieldsPosition_Obj.fieldsPosARS.length; i++) {
                        if ((plcPnt_X > fieldsPosition_Obj.fieldsPosARS[i][2] && plcPnt_X < fieldsPosition_Obj.fieldsPosARS[i][3]) && (plcPnt_Y > fieldsPosition_Obj.fieldsPosARS[i][0] && plcPnt_Y < fieldsPosition_Obj.fieldsPosARS[i][1])) {
                            let selectArea = i;
                            for (let j: number = 0; j < this.availableFields.length; j++) {   // Dostępne pola
                                if (selectArea === this.availableFields[j]) {   // Czy pozycja początkowa jest dostępna w "availableFields"?
                                    for (let f: number = 0; f < this.fullAreasBoardAR.length; f++) {   // Splicowana pełna tablica pól [.splice()] 
                                        if (selectArea === this.fullAreasBoardAR[f]) {   // Czy pozycja początkowa jest dostępna w splicowanym "fullAreasBoardAR"?
                                            console.log('yes');
                                            //return;
                                            let shipCoordinates: number[] = [];   // Tworzenie tablicy współrzędnych
                                            shipCoordinates[0] = selectArea;   // Ustalanie pozycji początkowej okrętu
                                            let incrVal = selectArea;   // Inicjowanie zmiennej inkrementalnej
                                            for (let k: number = 1; k < this.onceShipArgs[0]; k++) {   // Odpowiednia długość
                                                if (direction === 'B') {   // Odpowiedni kierunek, wybór inkrementowania w zależności od kierunku leżenia statku
                                                    incrVal += 10;
                                                } else if (direction === 'R') {
                                                    incrVal += 1;
                                                }
                                                for (let l: number = 0; l < this.fullAreasBoardAR.length; l++) {
                                                    if (incrVal == this.fullAreasBoardAR[l]) {
                                                        shipCoordinates[k] = incrVal;
                                                        //document.getElementById('clientShow').innerHTML = 'Setting ship is done!';
                                                    } else if (incrVal != this.fullAreasBoardAR[l]) {
                                                        //document.getElementById('clientShow').innerHTML = 'Is not possible to set ship here!';
                                                        //break;
                                                    }
                                                };
                                            };
                                            this.onceShipArgs[2] = shipCoordinates;
                                            console.log(shipCoordinates);
                                            document.getElementById('clientShow').innerHTML = this.onceShipArgs[2][0] + ' | ' + this.onceShipArgs[2][1] + ' | ' + this.onceShipArgs[2][2] + ' | ' + this.onceShipArgs[2][3] + ' | ' + this.onceShipArgs[2][4];
                                        } else {
                                            //console.log('Ta przestrzeń jest zajęta!');
                                            //return;
                                        }
                                    };
                                } else if (selectArea !== this.availableFields[j]) {
                                    //document.getElementById('clientShow').innerHTML = 'Is not possible to set ship here!';
                                    //return;
                                };
                            };
                        } else {}
                    };
                } else if (((plcPnt_X < usrBrd_Left || plcPnt_X > usrBrd_Right) || (plcPnt_Y < usrBrd_Top || plcPnt_Y > usrBrd_Bottom)) && this.placeShipSwitch === false) {
                    document.getElementById('clientShow').innerHTML = 'Is not possible to set ship here!';
                }
            }, false);
        });
    }
}
userChooseShipCor.fillFullAreasBoardAR();
userChooseShipCor.addUserShip_AEL();
userChooseShipCor.selectShip_AEL();
userChooseShipCor.mousemove_AEL();
userChooseShipCor.setShip_AEL();



// Fabryka statków:
interface intf_UserShip {
    shipNum: number,
    shipLgt: number,
    ship_Dir: string,
    shipHits: boolean[],
    shipStartCor: number,
    isSunken: boolean
};
class UserShipCor implements intf_UserShip {
    shipNum: number;
    shipLgt: number;
    ship_Dir: string;
    shipStartCor: number;
    constructor(arg_1, arg_2, arg_3, arg_4) {
        this.shipNum = arg_1;
        this.shipLgt = arg_2;
        this.ship_Dir = arg_3;
        this.shipStartCor = arg_4;
    };
    shipHits: [];
    isSunken: false;
};



const switch_Obj: {
    but: HTMLDivElement,
    startGame: Function,
    isStart: string,
    moveBoard: Function
} = {
    isStart: 'no',
    but: document.querySelector('div.click'),
    startGame(): void {
        ['click', 'touchend'].forEach((ev) => {
            this.but.addEventListener(ev, () => {
                this.moveBoard();
            }, false);
        });
    },
    moveBoard(): void {
        let cntMenu: HTMLDivElement = document.querySelector('div.inside-menu');
        let us: any = document.getElementById('bb-1');
        let com: any = document.getElementById('bb-2');
        if (this.isStart === 'no') {
            this.isStart = 'pause';
            cntMenu.style.bottom = '-500px';
            cntMenu.style.opacity = '0.0';
            cntMenu.style.transitionDuration = '0.5s';
            setTimeout(() => {
                us.style.right = '0px';
                us.style.transitionDuration = '0.5s';
                setTimeout(() => {
                    com.style.right = '0px';
                    com.style.opacity = '1.0';
                    com.style.transitionDuration = '0.5s';
                    setTimeout(() => {
                        this.isStart = 'yes';
                    }, 600);
                }, 500);
            }, 500);
        } else if (this.isStart === 'yes') {
            this.isStart = 'pause';
            com.style.right = '-500px';
            com.style.opacity = '0.0';
            com.style.transitionDuration = '0.5s';
            setTimeout(() => {
                us.style.right = '-500px';
                us.style.transitionDuration = '0.5s';
                setTimeout(() => {
                    cntMenu.style.bottom = '0px';
                    cntMenu.style.opacity = '1.0';
                    cntMenu.style.transitionDuration = '0.5s';
                    setTimeout(() => {
                        this.isStart = 'no';
                    }, 600);
                }, 500);
            }, 500);
        }
    }
};
switch_Obj.startGame();
