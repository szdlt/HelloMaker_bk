/*  2019.0915.15:09
modified from duncan
load dependency
"newbit": "file:../pxt-newbit"
*/
//% color="#C814B8" weight=25 icon="\uf1d4"
namespace newbit_显示类 {

    let lhRGBLight: QbitRGBLight.LHQbitRGBLight;
    //% blockId="initRGBLight" block="initRGBLight before use"
    //% weight=94
    export function initRGBLight() {
        if (!lhRGBLight) {
            lhRGBLight = QbitRGBLight.create(DigitalPin.P16, 4, QbitRGBPixelMode.RGB);
        }
        clearLight();
    }
    //% blockId="setBrightness" block="set brightness %brightness"
    //% brightness.min=0 brightness.max=255
    //% weight=92
    export function setBrightness(brightness: number): void {
        lhRGBLight.setBrightness(brightness);
    }
	/**
     * Set the color of the colored lights, after finished the setting please perform  the display of colored lights.
     */
    //% weight=91 blockId=setPixelRGB block="Set|%lightoffset|color to %rgb"
    export function setPixelRGB(lightoffset: Lights, rgb: QbitRGBColors) {
        lhRGBLight.setPixelColor(lightoffset, rgb, false);
    }
    /**
    * Set RGB Color argument
    */
    //% weight=90 blockId=setPixelRGBArgs block="Set|%lightoffset|color to %rgb"
    export function setPixelRGBArgs(lightoffset: Lights, rgb: number) {
        lhRGBLight.setPixelColor(lightoffset, rgb, false);
    }
	/**
     * Display the colored lights, and set the color of the colored lights to match the use. After setting the color of the colored lights, the color of the lights must be displayed.
     */
    //% weight=88 blockId=showLight block="Show light"
    export function showLight() {
        lhRGBLight.show();
    }

    /**
     * Clear the color of the colored lights and turn off the lights.
     */
    //% weight=86 blockGap=50 blockId=clearLight block="Clear light"
    export function clearLight() {
        lhRGBLight.clear();
    }

}

//% color="#87CEEB" weight=24 icon="\uf1b6"
namespace newbit_传感器类 {

    export enum enVoice {
        //% blockId="Voice" block="有声音"
        Voice = 0,
        //% blockId="NoVoice" block="无声音"
        NoVoice = 1
    }
    export enum enIR {
        //% blockId="Get" block="检测到"
        Get = 0,
        //% blockId="NoVoice" block="未检测到"
        NoGet = 1
    }
    export enum enOK {
        //% blockId="NotOK" block="异常"
        NotOK = 0,
        //% blockId="OK" block="正常"
        OK = 1
    }
    export enum Colors {
        //% blockId="Red" block="红色"
        Red = 0x01,
        //% blockId="Green" block="绿色"
        Green = 0x02,
        //% blockId="Blue" block="蓝色"
        Blue = 0x03,
        //% blockId="White" block="白色"
        White = 0x04,
        //% blockId="Black" block="黑色"
        Black = 0x05
    }
    const APDS9960_I2C_ADDR = 0x39;
    const APDS9960_ID_1 = 0xA8;
    const APDS9960_ID_2 = 0x9C;
    /* APDS-9960 register addresses */
    const APDS9960_ENABLE = 0x80;
    const APDS9960_ATIME = 0x81;
    const APDS9960_WTIME = 0x83;
    const APDS9960_AILTL = 0x84;
    const APDS9960_AILTH = 0x85;
    const APDS9960_AIHTL = 0x86;
    const APDS9960_AIHTH = 0x87;
    const APDS9960_PILT = 0x89;
    const APDS9960_PIHT = 0x8B;
    const APDS9960_PERS = 0x8C;
    const APDS9960_CONFIG1 = 0x8D;
    const APDS9960_PPULSE = 0x8E;
    const APDS9960_CONTROL = 0x8F;
    const APDS9960_CONFIG2 = 0x90;
    const APDS9960_ID = 0x92;
    const APDS9960_STATUS = 0x93;
    const APDS9960_CDATAL = 0x94;
    const APDS9960_CDATAH = 0x95;
    const APDS9960_RDATAL = 0x96;
    const APDS9960_RDATAH = 0x97;
    const APDS9960_GDATAL = 0x98;
    const APDS9960_GDATAH = 0x99;
    const APDS9960_BDATAL = 0x9A;
    const APDS9960_BDATAH = 0x9B;
    const APDS9960_PDATA = 0x9C;
    const APDS9960_POFFSET_UR = 0x9D;
    const APDS9960_POFFSET_DL = 0x9E;
    const APDS9960_CONFIG3 = 0x9F;

    const LED_DRIVE_100MA = 0;
    const LED_DRIVE_50MA = 1;
    const LED_DRIVE_25MA = 2;
    const LED_DRIVE_12_5MA = 3;

    /* ALS Gain (AGAIN) values */
    const AGAIN_1X = 0;
    const AGAIN_4X = 1;
    const AGAIN_16X = 2;
    const AGAIN_64X = 3;

    /* Default values */
    const DEFAULT_ATIME = 219;    // 103ms
    const DEFAULT_WTIME = 246;    // 27ms
    const DEFAULT_PROX_PPULSE = 0x87;    // 16us, 8 pulses
    const DEFAULT_GESTURE_PPULSE = 0x89;    // 16us, 10 pulses
    const DEFAULT_POFFSET_UR = 0;       // 0 offset
    const DEFAULT_POFFSET_DL = 0;       // 0 offset      
    const DEFAULT_CONFIG1 = 0x60;    // No 12x wait (WTIME) factor
    const DEFAULT_PILT = 0;       // Low proximity threshold
    const DEFAULT_PIHT = 50;      // High proximity threshold
    const DEFAULT_AILT = 0xFFFF;  // Force interrupt for calibration
    const DEFAULT_AIHT = 0;
    const DEFAULT_PERS = 0x11;    // 2 consecutive prox or ALS for int.
    const DEFAULT_CONFIG2 = 0x01;    // No saturation interrupts or LED boost  
    const DEFAULT_CONFIG3 = 0;       // Enable all photodiodes, no SAI
    const DEFAULT_GPENTH = 40;      // Threshold for entering gesture mode
    const DEFAULT_GEXTH = 30;      // Threshold for exiting gesture mode    
    const DEFAULT_GCONF1 = 0x40;    // 4 gesture events for int., 1 for exit
    const DEFAULT_GOFFSET = 0;       // No offset scaling for gesture mode
    const DEFAULT_GPULSE = 0xC9;    // 32us, 10 pulses
    const DEFAULT_GCONF3 = 0;       // All photodiodes active during gesture
    const DEFAULT_GIEN = 0;       // Disable gesture interrupts
    const DEFAULT_LDRIVE = LED_DRIVE_100MA;
    const DEFAULT_AGAIN = AGAIN_4X;


    const OFF = 0;
    const ON = 1;
    const POWER = 0;
    const AMBIENT_LIGHT = 1;
    const PROXIMITY = 2;
    const WAIT = 3;
    const AMBIENT_LIGHT_INT = 4;
    const PROXIMITY_INT = 5;
    const GESTURE = 6;
    const ALL = 7;


    function i2cwrite(reg: number, value: number) {
        let buf = pins.createBuffer(2);
        buf[0] = reg;
        buf[1] = value;
        pins.i2cWriteBuffer(APDS9960_I2C_ADDR, buf);
    }

    function i2cread(reg: number): number {
        pins.i2cWriteNumber(APDS9960_I2C_ADDR, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(APDS9960_I2C_ADDR, NumberFormat.UInt8BE);
        return val;
    }

    function InitColor(): boolean {
        let id = i2cread(APDS9960_ID);
        //  serial.writeLine("id:")
        //  serial.writeNumber(id); 
        if (!(id == APDS9960_ID_1 || id == APDS9960_ID_2)) {
            return false;
        }
        //  serial.writeLine("set mode:")
        setMode(ALL, OFF);
        i2cwrite(APDS9960_ATIME, DEFAULT_ATIME);
        i2cwrite(APDS9960_WTIME, DEFAULT_WTIME);
        i2cwrite(APDS9960_PPULSE, DEFAULT_PROX_PPULSE);
        i2cwrite(APDS9960_POFFSET_UR, DEFAULT_POFFSET_UR);
        i2cwrite(APDS9960_POFFSET_DL, DEFAULT_POFFSET_DL);
        i2cwrite(APDS9960_CONFIG1, DEFAULT_CONFIG1);
        setLEDDrive(DEFAULT_LDRIVE);
        setAmbientLightGain(DEFAULT_AGAIN);
        setLightIntLowThreshold(DEFAULT_AILT);
        setLightIntHighThreshold(DEFAULT_AIHT);
        i2cwrite(APDS9960_PERS, DEFAULT_PERS);
        i2cwrite(APDS9960_CONFIG2, DEFAULT_CONFIG2);
        i2cwrite(APDS9960_CONFIG3, DEFAULT_CONFIG3);
        return true;
    }

    function setMode(mode: number, enable: number) {
        let reg_val = getMode();
        /* Change bit(s) in ENABLE register */
        enable = enable & 0x01;
        if (mode >= 0 && mode <= 6) {
            if (enable > 0) {
                reg_val |= (1 << mode);
            }
            else {
                //reg_val &= ~(1 << mode);
                reg_val &= (0xff - (1 << mode));
            }
        }
        else if (mode == ALL) {
            if (enable > 0) {
                reg_val = 0x7F;
            }
            else {
                reg_val = 0x00;
            }
        }
        i2cwrite(APDS9960_ENABLE, reg_val);
    }

    function getMode(): number {
        let enable_value = i2cread(APDS9960_ENABLE);
        return enable_value;
    }

    function setLEDDrive(drive: number) {
        let val = i2cread(APDS9960_CONTROL);
        /* Set bits in register to given value */
        drive &= 0b00000011;
        drive = drive << 6;
        val &= 0b00111111;
        val |= drive;
        i2cwrite(APDS9960_CONTROL, val);
    }

    function setLightIntLowThreshold(threshold: number) {
        let val_low = threshold & 0x00FF;
        let val_high = (threshold & 0xFF00) >> 8;
        i2cwrite(APDS9960_AILTL, val_low);
        i2cwrite(APDS9960_AILTH, val_high);
    }

    function setLightIntHighThreshold(threshold: number) {
        let val_low = threshold & 0x00FF;
        let val_high = (threshold & 0xFF00) >> 8;
        i2cwrite(APDS9960_AIHTL, val_low);
        i2cwrite(APDS9960_AIHTH, val_high);
    }


    function enableLightSensor(interrupts: boolean) {
        setAmbientLightGain(DEFAULT_AGAIN);
        if (interrupts) {
            setAmbientLightIntEnable(1);
        }
        else {
            setAmbientLightIntEnable(0);
        }
        enablePower();
        setMode(AMBIENT_LIGHT, 1);
    }

    function setAmbientLightGain(drive: number) {
        let val = i2cread(APDS9960_CONTROL);
        /* Set bits in register to given value */
        drive &= 0b00000011;
        val &= 0b11111100;
        val |= drive;
        i2cwrite(APDS9960_CONTROL, val);
    }

    function getAmbientLightGain(): number {
        let val = i2cread(APDS9960_CONTROL);
        val &= 0b00000011;
        return val;
    }

    function enablePower() {
        setMode(POWER, 1);
    }

    function setAmbientLightIntEnable(enable: number) {
        let val = i2cread(APDS9960_ENABLE);
        /* Set bits in register to given value */
        enable &= 0b00000001;
        enable = enable << 4;
        val &= 0b11101111;
        val |= enable;
        i2cwrite(APDS9960_ENABLE, val);
    }

    function readAmbientLight(): number {
        let val_byte = i2cread(APDS9960_CDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_CDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readRedLight(): number {

        let val_byte = i2cread(APDS9960_RDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_RDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readGreenLight(): number {

        let val_byte = i2cread(APDS9960_GDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_GDATAH);
        val = val + val_byte << 8;
        return val;
    }

    function readBlueLight(): number {

        let val_byte = i2cread(APDS9960_BDATAL);
        let val = val_byte;
        val_byte = i2cread(APDS9960_BDATAH);
        val = val + val_byte << 8;
        return val;
    }

    //% blockId=newbit_initColorSensor block="initColorSensor|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function initColorSensor() {
        InitColor();
        enableLightSensor(false);
        control.waitMicros(100);
    }

    /*
 *  Color sensor to obtain color value.
 */
    //% weight=84 blockId=newbit_checkCurrentColor block="checkCurrentColor|color %color" 
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function checkCurrentColor(color: Colors): boolean {
        //       setBrightness(150);     
        //       setPixelRGB(Lights.Light1, DlbitRGBColors.White);
        //       setPixelRGB(Lights.Light2, DlbitRGBColors.White);
        //       showLight(); 
        let r = readRedLight();
        let g = readGreenLight();
        let b = readBlueLight();
        let t = Colors.Red;

        if (r > g) {
            t = Colors.Red;
        }
        else {
            t = Colors.Green;
        }

        if (t == Colors.Green && g < b) {
            if (b - g > 1000)
                t = Colors.Blue;
        }
        if (t == Colors.Red && r < b) {
            t = Colors.Blue;
        }
        //          serial.writeNumber(r); 
        //          serial.writeLine("->red");
        //          serial.writeNumber(g); 
        //          serial.writeLine("->green"); 
        //          serial.writeNumber(b); 
        //          serial.writeLine("->blue"); 

        if (r > 6800 && g > 8000 && b > 12000) {
            t = Colors.White;
        }
        else if (r < 800 && g < 1100 && b < 1300) {
            t = Colors.Black;
        }
        else if (t == Colors.Blue && b > 2800) {
            //        serial.writeLine("blue");

        }
        else if (t == Colors.Green && g > 1500) {
            // serial.writeLine("green");
        }
        else if (t == Colors.Red && r > 3000) {
            //serial.writeLine("red");
        }
        else {
            //serial.writeLine("none");
            return false;
        }
        return (color == t);
    }

    //% blockId=newbit_Voice_Sensor block="Voice_Sensor|value %value|声音"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Voice_Sensor(value: enVoice): boolean {

        pins.setPull(DigitalPin.P3, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P3) == value) {
            return true;
        }
        else {
            return false;
        }

    }
    //% blockId=newbit_Incline_Sensor block="Incline_Sensor|%value|倾斜"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Incline_Sensor(value: enIR): boolean {

        pins.setPull(DigitalPin.P9, PinPullMode.PullUp);
        //IR_send_38k();
        if (pins.digitalReadPin(DigitalPin.P9) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    //% blockId=newbit_Smog_Sensor block="Smog_Sensor|%value|烟雾"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Smog_Sensor(value: enIR): boolean {

        pins.setPull(DigitalPin.P3, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P3) == value) {
            return true;
        }
        else {
            return false;
        }

    }
    //% blockId=newbit_Humidity_Sensor block="Humidity_Sensor|土壤湿度|%value"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Humidity_Sensor(value: enOK): boolean {

        pins.setPull(DigitalPin.P3, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P3) == value) {
            return false;
        }
        else {
            return true;
        }

    }



    //% blockId=newbit_Touch_Sensor block="Touch_Sensor|%value|触摸"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Touch_Sensor(value: enIR): boolean {

        pins.setPull(DigitalPin.P9, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P9) == value) {
            return false;
        }
        else {
            return true;
        }

    }
    //% blockId=newbit_Photosensitive_Sensor block="Photosensitive_Sensor|%value|光照"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Photosensitive_Sensor(value: enIR): boolean {

        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P8) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    //% blockId=newbit_Flame_Sensor block="Flame_Sensor|%value|火焰"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Flame_Sensor(value: enIR): boolean {

        pins.setPull(DigitalPin.P8, PinPullMode.PullUp);
        if (pins.digitalReadPin(DigitalPin.P8) == value) {
            return true;
        }
        else {
            return false;
        }

    }

    function IR_send_38k() {
        for (let i: number = 0; i < 8; i++) {
            pins.digitalWritePin(DigitalPin.P9, 1);
            control.waitMicros(13);
            pins.digitalWritePin(DigitalPin.P9, 0);
            control.waitMicros(13);
        }
    }
    //% blockId=newbit_IR_Sensor block="IR_Sensor|%value|障碍物"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function IR_Sensor(pin: DigitalPin, value: enIR): boolean {

        pins.setPull(pin, PinPullMode.PullUp);
        //IR_send_38k();
        if (pins.digitalReadPin(pin) == value) {
            return true;
        }
        else {
            return false;
        }
    }

    //% blockId=newbit_IR_Send block="IR_Send|pin %pin"
    //% weight=100
    //% blockGap=10
    //% color="#87CEEB"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    function IR_Send(pin: DigitalPin): void {
        IR_send_38k();
    }
}

/*****************************************************************************************************************************************
 *    音乐类 *****************************************************************************************************************************
 ****************************************************************************************************************************************/

//% color="#D2691E" weight=22 icon="\uf001"
namespace newbit_音乐类 {
    export enum enBuzzer {
        //% blockId="NoBeep" block="不响"
        NoBeep = 0,
        //% blockId="Beep" block="响"
        Beep
    }
    //% blockId=newbit_Buzzer block="Buzzer"
    //% weight=100
    //% blockGap=10 
    //% color="#D2691E"
    //% value.min=0 value.max=1
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=8
    export function Buzzer(): void {
        pins.setPull(DigitalPin.P0, PinPullMode.PullNone);
        pins.digitalWritePin(DigitalPin.P0, 0);
    }
}
/*****************************************************************************************************************************************
 *电机类 *****************************************************************************************************************************
 ****************************************************************************************************************************************/

//% color="#0000CD" weight=21 icon="\uf185"

namespace newbit_电机类 {

    //% blockId=newbit_Vibrator_Open block="Vibrator_Open"
    //% weight=100
    //% blockGap=10
    //% color="#0000CD"
    //% value.min=0 value.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Vibrator_Open(): void {

        pins.digitalWritePin(DigitalPin.P12, 1);

    }
    //% blockId=newbit_Vibrator_Close block="Vibrator_Close"
    //% weight=100
    //% blockGap=10
    //% color="#0000CD"
    //% value.min=0 value.max=1023
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Vibrator_Close(): void {
        pins.digitalWritePin(DigitalPin.P12, 0);
    }
}

//% color="#006400" weight=20 icon="\uf1b9"
namespace newbit_小车类 {

    const PCA9685_ADD = 0x41
    const MODE1 = 0x00
    const MODE2 = 0x01
    const SUBADR1 = 0x02
    const SUBADR2 = 0x03
    const SUBADR3 = 0x04

    const LED0_ON_L = 0x06
    const LED0_ON_H = 0x07
    const LED0_OFF_L = 0x08
    const LED0_OFF_H = 0x09

    const ALL_LED_ON_L = 0xFA
    const ALL_LED_ON_H = 0xFB
    const ALL_LED_OFF_L = 0xFC
    const ALL_LED_OFF_H = 0xFD

    const PRESCALE = 0xFE
    let initialized = false
    let g_mode = 0
    let value_past = 0
    let value1_past = -1
    let value2_past = -1
    let value3_past = -1
    let value4_past = -1
    let value5_past = -1
    let value6_past = -1
    let car_speed = 200
    export enum enMusic {
        dadadum = 0,
        entertainer,
        prelude,
        ode,
        nyan,
        ringtone,
        funk,
        blues,
        birthday,
        wedding,
        funereal,
        punchline,
        baddy,
        chase,
        ba_ding,
        wawawawaa,
        jump_up,
        jump_down,
        power_up,
        power_down
    }
    export enum enPos {
        //% blockId="LeftState" block="左边状态"
        LeftState = 0,
        //% blockId="RightState" block="右边状态"
        RightState = 1
    }
    export enum enLineState {
        //% blockId="White" block="白线"
        White = 0,
        //% blockId="Black" block="黑线"
        Black = 1
    }
    export enum enAvoidState {
        //% blockId="OBSTACLE" block="有障碍物"
        OBSTACLE = 0,
        //% blockId="NOOBSTACLE" block="无障碍物"
        NOOBSTACLE = 1
    }
    export enum enServo {
        S1 = 1,
        S2,
        S3,
        S4,
        S5,
        S6
    }
    export enum CarRunState {
        //% blockId="Car_Normal" block="正常"
        Car_Normal = 0,
        //% blockId="Car_XunJi" block="寻迹"
        Car_XunJi = 1,
        //% blockId="Car_BiZhang" block="避障"  
        Car_BiZhang = 2

    }
    export enum MotorNum {
        //% blockId="Motor0" block="电机1"
        Motor0 = 0,
        //% blockId="Motor1"  block="电机2"
        Motor1 = 1


    }
    export enum MotorDir {
        //% blockId="clockwise" block="正转"
        clockwise = 0,
        //% blockId="anticlockwise" block="反转"
        anticlockwise = 1
    }
    export enum CarState {
        //% blockId="Car_Run" block="前行"
        Car_Run = 1,
        //% blockId="Car_Back" block="后退"
        Car_Back = 2,
        //% blockId="Car_Left" block="左转"
        Car_Left = 3,
        //% blockId="Car_Right" block="右转"
        Car_Right = 4,
        //% blockId="Car_Stop" block="停止"
        Car_Stop = 5,
        //% blockId="Car_SpinLeft" block="原地左旋"
        Car_SpinLeft = 6,
        //% blockId="Car_SpinRight" block="原地右旋"
        Car_SpinRight = 7,
        //% blockId="Car_SpeedUp" block="加速"
        Car_SpeedUp = 8,
        //% blockId="Car_SpeedDown" block="减速"
        Car_SpeedDown = 9
    }


    function i2cwrite_(addr: number, reg: number, value: number) {
        let buf = pins.createBuffer(2)
        buf[0] = reg
        buf[1] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2ccmd(addr: number, value: number) {
        let buf = pins.createBuffer(1)
        buf[0] = value
        pins.i2cWriteBuffer(addr, buf)
    }
    function i2cread(addr: number, reg: number) {
        pins.i2cWriteNumber(addr, reg, NumberFormat.UInt8BE);
        let val = pins.i2cReadNumber(addr, NumberFormat.UInt8BE);
        return val;
    }
    function initPCA9685(): void {
        i2cwrite_(PCA9685_ADD, MODE1, 0x00)
        setFreq(50);
        initialized = true
    }
    function setFreq(freq: number): void {
        // Constrain the frequency
        let prescaleval = 25000000;
        prescaleval /= 4096;
        prescaleval /= freq;
        prescaleval -= 1;
        let prescale = prescaleval; //Math.Floor(prescaleval + 0.5);
        let oldmode = i2cread(PCA9685_ADD, MODE1);
        let newmode = (oldmode & 0x7F) | 0x10; // sleep
        i2cwrite_(PCA9685_ADD, MODE1, newmode); // go to sleep
        i2cwrite_(PCA9685_ADD, PRESCALE, prescale); // set the prescaler
        i2cwrite_(PCA9685_ADD, MODE1, oldmode);
        control.waitMicros(5000);
        i2cwrite_(PCA9685_ADD, MODE1, oldmode | 0xa1);
    }
    function setPwm(channel: number, on: number, off: number): void {
        if (channel < 0 || channel > 15)
            return;
        if (!initialized) {
            initPCA9685();
        }
        if (channel < 9 && channel > 5)
            channel += 3;
        let buf = pins.createBuffer(5);
        buf[0] = LED0_ON_L + 4 * channel;
        buf[1] = on & 0xff;
        buf[2] = (on >> 8) & 0xff;
        buf[3] = off & 0xff;
        buf[4] = (off >> 8) & 0xff;
        pins.i2cWriteBuffer(PCA9685_ADD, buf);
    }


    function Car_run(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350) {
            speed = 350
        }
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);
        //pins.digitalWritePin(DigitalPin.P16, 1);
        // pins.analogWritePin(AnalogPin.P1, 1023-speed); //速度控制

        // pins.analogWritePin(AnalogPin.P0, speed);//速度控制
        // pins.digitalWritePin(DigitalPin.P8, 0);
    }
    function Car_back(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        setPwm(12, 0, 0);
        setPwm(13, 0, speed);
        setPwm(15, 0, 0);
        setPwm(14, 0, speed);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.analogWritePin(AnalogPin.P1, speed); //速度控制
        //pins.analogWritePin(AnalogPin.P0, 1023 - speed);//速度控制
        //pins.digitalWritePin(DigitalPin.P8, 1);
    }
    function Car_left(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);
        //pins.analogWritePin(AnalogPin.P0, speed);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.digitalWritePin(DigitalPin.P1, 0);
    }
    function Car_right(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);

        setPwm(15, 0, 0);
        setPwm(14, 0, 0);
        //pins.digitalWritePin(DigitalPin.P0, 0);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 1);
        // pins.analogWritePin(AnalogPin.P1, 1023 - speed);
    }
    function Car_stop() {
        setPwm(12, 0, 0);
        setPwm(13, 0, 0);
        setPwm(15, 0, 0);
        setPwm(14, 0, 0);
        //pins.digitalWritePin(DigitalPin.P0, 0);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.digitalWritePin(DigitalPin.P1, 0);
    }
    function Car_spinleft(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        setPwm(12, 0, 0);
        setPwm(13, 0, speed);
        setPwm(15, 0, speed);
        setPwm(14, 0, 0);
        //pins.analogWritePin(AnalogPin.P0, speed);
        //pins.digitalWritePin(DigitalPin.P8, 0);
        //pins.digitalWritePin(DigitalPin.P16, 0);
        //pins.analogWritePin(AnalogPin.P1, speed);
    }
    function Car_spinright(speed: number) {
        speed = speed * 16; // map 350 to 4096
        if (speed >= 4096) {
            speed = 4095
        }
        if (speed <= 350 && speed != 0) {
            speed = 350
        }
        setPwm(12, 0, speed);
        setPwm(13, 0, 0);
        setPwm(15, 0, 0);
        setPwm(14, 0, speed);
        //pins.analogWritePin(AnalogPin.P0, 1023-speed);
        //pins.digitalWritePin(DigitalPin.P8, 1);
        //pins.digitalWritePin(DigitalPin.P16, 1);
        //pins.analogWritePin(AnalogPin.P1, 1023-speed);
    }
    function Car_SpeedUp() {
        if (car_speed <= 250)
            car_speed += 5;
    }
    function Car_SpeedDown() {
        if (car_speed >= 50)
            car_speed -= 5;
    }

    //% blockId=newbit_ultrasonic_car block="ultrasonic return distance(cm)"
    //% color="#006400"
    //% weight=98
    //% blockGap=10
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=4
    export function Ultrasonic_Car(): number {
        let echoPin: DigitalPin = DigitalPin.P15;
        let trigPin: DigitalPin = DigitalPin.P14;
        pins.setPull(echoPin, PinPullMode.PullNone);
        pins.setPull(trigPin, PinPullMode.PullNone);
        // send pulse
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        pins.digitalWritePin(trigPin, 1);
        control.waitMicros(10);
        pins.digitalWritePin(trigPin, 0);
        control.waitMicros(5);
        // read pulse
        let d = pins.pulseIn(echoPin, PulseValue.High, 11600);
        basic.pause(10);
        return Math.floor(d / 40);
        // send pulse
        //    pins.setPull(DigitalPin.P14, PinPullMode.PullNone);    
        //    pins.digitalWritePin(DigitalPin.P14, 0);
        //     control.waitMicros(2);
        //   pins.digitalWritePin(DigitalPin.P14, 1);
        //   control.waitMicros(10);
        //   pins.digitalWritePin(DigitalPin.P14, 0);

        // read pulse
        //   let d = pins.pulseIn(DigitalPin.P15, PulseValue.High, 43200);
        //  return d / 58;
    }

    //% blockId=newbit_Servo_Car block="Servo_Car|num %num|value %value |速度 %speed"
    //% weight=96
    //% blockGap=10
    //% speed.min=1 speed.max=10
    //% color="#006400"
    //% num.min=1 num.max=6 value.min=0 value.max=180
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function Servo_Car(num: enServo, value: number, speed: number): void {
        // 50hz: 20,000 us
        if (num == 1) { value_past = value1_past; }
        else if (num == 2) { value_past = value2_past; }
        else if (num == 3) { value_past = value3_past; }
        else if (num == 4) { value_past = value4_past; }
        else if (num == 5) { value_past = value5_past; }
        else if (num == 6) { value_past = value6_past; }


        while (value_past != value) {
            if (speed == 0 || value_past == -1) {
                value_past = value;
                let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                let pwm = us * 4096 / 20000;
                setPwm(num + 2, 0, pwm);
            }
            else {
                if (value_past > value) {

                    value_past - speed > value ? value_past -= speed : value_past--;
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                    basic.pause(20);

                }
                else if (value_past < value) {

                    value_past + speed < value ? value_past += speed : value_past++;
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                    basic.pause(20);
                }
                {
                    let us = (value_past * 1800 / 180 + 600); // 0.6 ~ 2.4
                    let pwm = us * 4096 / 20000;
                    setPwm(num + 2, 0, pwm);
                }

            }
        }
        if (num == 1) { value1_past = value; }
        else if (num == 2) { value2_past = value; }
        else if (num == 3) { value3_past = value; }
        else if (num == 4) { value4_past = value; }
        else if (num == 5) { value5_past = value; }
        else if (num == 6) { value6_past = value; }
    }
    //% blockId=newbit_Avoid_Sensor block="Avoid_Sensor|value %value"
    //% weight=95
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Avoid_Sensor(value: enAvoidState): boolean {
        let temp: boolean = false;
        //     pins.digitalWritePin(DigitalPin.P9, 0);
        switch (value) {
            case enAvoidState.OBSTACLE: {
                if (pins.analogReadPin(AnalogPin.P1) < 800) {
                    temp = true;
                    //   setPwm(8, 0, 0);
                }
                else {
                    temp = false;
                    //     setPwm(8, 0, 4095);
                }
                break;
            }
            case enAvoidState.NOOBSTACLE: {
                if (pins.analogReadPin(AnalogPin.P1) > 800) {
                    temp = true;
                    //     setPwm(8, 0, 4095);
                }
                else {
                    temp = false;
                    //    setPwm(8, 0, 0);
                }
                break;
            }
        }
        //    pins.digitalWritePin(DigitalPin.P9, 1);
        return temp;
    }
    //% blockId=newbit_Line_Sensor block="Line_Sensor|direct %direct|value %value"
    //% weight=94
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=12
    export function Line_Sensor(direct: enPos, value: enLineState): boolean {
        let temp: boolean = false;
        switch (direct) {
            case enPos.LeftState: {
                if (pins.analogReadPin(AnalogPin.P2) < 500) {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                    setPwm(7, 0, 4095);
                }
                else {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                    setPwm(7, 0, 0);
                }
                break;
            }
            case enPos.RightState: {
                if (pins.analogReadPin(AnalogPin.P1) < 500) {
                    if (value == enLineState.White) {
                        temp = true;
                    }
                    setPwm(6, 0, 4095);
                }
                else {
                    if (value == enLineState.Black) {
                        temp = true;
                    }
                    setPwm(6, 0, 0);
                }
                break;
            }
        }
        return temp;
    }
    //% blockId=newbit_CarCtrl block="CarCtrl|%index"
    //% weight=93
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrl(index: CarState): void {
        switch (index) {
            case CarState.Car_Run: Car_run(car_speed); break;
            case CarState.Car_Back: Car_back(car_speed); break;
            case CarState.Car_Left: Car_left(car_speed); break;
            case CarState.Car_Right: Car_right(car_speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(car_speed); break;
            case CarState.Car_SpinRight: Car_spinright(car_speed); break;
            case CarState.Car_SpeedUp: Car_SpeedUp(); break;
            case CarState.Car_SpeedDown: Car_SpeedDown(); break;
        }
    }
    //% blockId=newbit_CarCtrlSpeed block="CarCtrlSpeed|%index|speed %speed"
    //% weight=92
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function CarCtrlSpeed(index: CarState, speed: number): void {
        switch (index) {
            case CarState.Car_Run: Car_run(speed); break;
            case CarState.Car_Back: Car_back(speed); break;
            case CarState.Car_Left: Car_left(speed); break;
            case CarState.Car_Right: Car_right(speed); break;
            case CarState.Car_Stop: Car_stop(); break;
            case CarState.Car_SpinLeft: Car_spinleft(speed); break;
            case CarState.Car_SpinRight: Car_spinright(speed); break;
        }
    }
    //% blockId=newbit_MotorRun block="MotorRun|%index0|%index1|speed%speed"
    //% weight=93
    //% blockGap=10
    //% speed.min=0 speed.max=255
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=10
    export function MotorRun(index0: MotorNum, index1: MotorDir, speed: number) {
        if (index0 == MotorNum.Motor1) {
            if (index1 == MotorDir.clockwise) {
                setPwm(12, 0, speed * 16);
                setPwm(13, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(12, 0, 0);
                setPwm(13, 0, speed * 16);

            }
        }
        else if (index0 == MotorNum.Motor0) {
            if (index1 == MotorDir.clockwise) {
                setPwm(14, 0, speed * 16);
                setPwm(15, 0, 0);

            }
            else if (index1 == MotorDir.anticlockwise) {
                setPwm(15, 0, speed * 16);
                setPwm(14, 0, 0);

            }

        }
    }
}

//% color="#212121" weight=24 icon="\uf1b6"
namespace newbit_积木类 {

    let StrAt = -1
    let MoveType = -1
    let dlbot_pos = -1
    let dlbot_id = -1
    let dlbot_speed = -1
    let rgb_id = -1
    let rgb_color = -1
    let rgb_bright = -1
    let color_id = -1
    let tone = -1
    let dlbot_beat = -1
    let show_number = -1
    let coo_x = -1
    let coo_y = -1
    let coo_on = -1
    let hour = -1
    let minus = -1
    let mode = -1
    let move = -1
    let speed = -1
    let time = -1
    let direction = -1
    let position = -1
    let pin = -1
    let analog_pin = -1
    let Stm32_POS = -1
    let Stm32_ID = -1
    let Stm32_GROUP = -1
    let Robot_Mode = -1
    let Move_T = -1
    let stringReceive = ""
    let Tone = [65, 65, 73, 82, 87, 98, 110, 123,
        131, 147, 165, 175, 196, 220, 247,
        262, 294, 330, 349, 392, 440, 494,
        523, 587, 659, 698, 784, 880, 988,
        1047, 1175, 1319, 1397, 1568, 1760, 1976,
        2093, 2349, 2637, 2794, 3136, 3520, 3951,
        4186, 4699]
    let Beat = [16, 16, 8, 4, 2, 1, 32, 64]
    enum CMD_TYPE {
        NO_COMMAND,
        MST,
        DST,
        STO,
        LIG,
        COL,
        TON,
        VER,
        POS,
        COO,
        TIM,
        MOD,
        SEN,
        SNB,
        CHE,
        EXT,
        TEM,
        STA,
        SERVO_MOVE,
        SERVO_ONE,
        SERVO_GROUP,
        STM32_MOVE,
        ROBOT_MODE_BIZHANG,
        ROBOT_MODE_XUNJI

    }
    let CMD_MULT_SERVO_MOVE = 3
    let CMD_FULL_ACTION_RUN = 6
    let CMD_TANK_FRONT = 9
    let CMD_TANK_BACK = 10
    let CMD_TANK_LEFT = 11
    let CMD_TANK_RIGHT = 12
    let CMD_TANK_STOP = 17
    let cmdType = -1

    function UartSend4data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 100) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 1000) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else {
            serial.writeNumber(num)
        }
    }

    function UartSend3data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else if (num < 100) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }
        else {
            serial.writeNumber(num)
        }
    }

    function UartSend2data(num: number) {
        if (num < 10) {
            serial.writeNumber(0)
            serial.writeNumber(num)
        }

        else {
            serial.writeNumber(num)
        }
    }

    function SendOneServoToMcu(time: number, id: number, pos: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(1)
        serial.writeNumber(2)
        serial.writeNumber(0)
        serial.writeNumber(3)
        serial.writeNumber(1)
        serial.writeNumber(0)
        serial.writeNumber(0)
        serial.writeNumber(id)
        UartSend4data(pos)
    }

    function SendRobotModeToMcu(mode: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(4)
        serial.writeNumber(0)
        UartSend2data(mode)

    }


    function SendServoGroupToMcu(group: number, times: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(1)
        serial.writeNumber(0)
        serial.writeNumber(0)
        serial.writeNumber(6)
        UartSend3data(group)
        UartSend3data(times)
    }
    function SendMoveTypeToMcu(type: number) {

        serial.writeNumber(2)
        serial.writeNumber(2)
        serial.writeNumber(0)
        serial.writeNumber(4)
        UartSend2data(type)
    }

    //% blockId=newbit_BuildingBlocksInit block="BuildingBlocksInit"
    //% weight=96
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9
    export function BuildingBlocksInit() {

        serial.redirect(
            SerialPin.P12,
            SerialPin.P13,
            BaudRate.BaudRate9600)
        newbit_传感器类.initColorSensor()
        newbit_显示类.initRGBLight()
        newbit_显示类.setPixelRGB(Lights.Light1, QbitRGBColors.Red)
        newbit_显示类.setPixelRGB(Lights.Light2, QbitRGBColors.Red)
        newbit_显示类.showLight()
        newbit_电机类.Vibrator_Close()
        newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S1, 90, 0)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S2, 90, 0)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S3, 90, 0)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S4, 90, 0)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S5, 90, 0)
        newbit_小车类.Servo_Car(newbit_小车类.enServo.S6, 90, 0)
    }

    //% blockId=newbit_BuildingBlocks block="BuildingBlocks|%uartData"
    //% weight=96
    //% blockGap=10
    //% color="#006400"
    //% name.fieldEditor="gridpicker" name.fieldOptions.columns=9

    export function BuildingBlocks(uartData: string): number {
        if (uartData.indexOf("*@") != -1) {
            if (uartData.indexOf("Serone") != -1) {
                StrAt = uartData.indexOf("Serone")
                Stm32_POS = parseInt(uartData.substr(StrAt + 7, 4))
                Stm32_ID = parseInt(uartData.substr(StrAt + 12, 1))
                SendOneServoToMcu(100, Stm32_ID, Stm32_POS)
                cmdType = CMD_TYPE.SERVO_ONE
            }
            else if (uartData.indexOf("Sergroup") != -1) {
                StrAt = uartData.indexOf("Sergroup")
                Stm32_GROUP = parseInt(uartData.substr(StrAt + 9, 3))
                SendServoGroupToMcu(Stm32_GROUP, 1)
                cmdType = CMD_TYPE.SERVO_GROUP
            }
	     else if (uartData.indexOf("Sercontrol-Z") != -1) {

                cmdType = CMD_TYPE.ROBOT_MODE_BIZHANG
            }
            else if (uartData.indexOf("Sercontrol-X") != -1) {

                cmdType = CMD_TYPE.ROBOT_MODE_XUNJI
            }
            else if (uartData.indexOf("Sercontrol") != -1) {

                StrAt = uartData.indexOf("Sercontrol")  // 

                if (uartData.charAt(StrAt + 11) == 'S') {
                    newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Run)
                    Move_T = 9
                }
                else if (uartData.charAt(StrAt + 11) == 'B') {
                    newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Back)
                    Move_T = 10
                }
                else if (uartData.charAt(StrAt + 11) == 'L') {
                    newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Left)
                    Move_T = 11
                }
                else if (uartData.charAt(StrAt + 11) == 'R') {
                    newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Right)
                    Move_T = 12
                }
                else if (uartData.charAt(StrAt + 11) == '0') {
                    newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                    Move_T = 17
                }
                else {
                    Move_T = 17
                }
                SendMoveTypeToMcu(Move_T)
                cmdType = CMD_TYPE.STM32_MOVE
            }
            else if (uartData.indexOf("mst") != -1) {
                StrAt = uartData.indexOf("mst")
                move = parseInt(uartData.substr(StrAt + 4, 1))
                speed = parseInt(uartData.substr(StrAt + 6, 3))
                time = parseInt(uartData.substr(StrAt + 10, 2))

                if (move == 1) {
                    newbit_小车类.CarCtrlSpeed(newbit_小车类.CarState.Car_Run, speed * 2.5)
                    basic.pause(time * 1000)
                    if (time != 0) {
                        newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                    }
                }
                else if (move == 2) {
                    newbit_小车类.CarCtrlSpeed(newbit_小车类.CarState.Car_Back, speed * 2.5)
                    basic.pause(time * 1000)
                    if (time != 0) {
                        newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                    }
                }
                cmdType = CMD_TYPE.MST;

            }
            else if (uartData.indexOf("dst") != -1) {
                StrAt = uartData.indexOf("dst")
                direction = parseInt(uartData.substr(StrAt + 4, 1))
                speed = parseInt(uartData.substr(StrAt + 6, 3))
                time = parseInt(uartData.substr(StrAt + 10, 2))
                if (direction == 1) {  // right
                    newbit_小车类.CarCtrlSpeed(newbit_小车类.CarState.Car_SpinRight, speed * 2.5) // 
                    basic.pause(time * 1000)
                    if (time != 0) {
                        newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                    }
                }
                else if (direction == 2) {  // left
                    newbit_小车类.CarCtrlSpeed(newbit_小车类.CarState.Car_SpinLeft, speed * 2.5)
                    basic.pause(time * 1000)
                    if (time != 0) {
                        newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                    }
                }
                cmdType = CMD_TYPE.DST;
            }
            else if (uartData.indexOf("sto") != -1) {
                newbit_小车类.CarCtrl(newbit_小车类.CarState.Car_Stop)
                cmdType = CMD_TYPE.STO;
            }
            else if (uartData.indexOf("lig") != -1) {
                StrAt = uartData.indexOf("lig")
                rgb_id = parseInt(uartData.substr(StrAt + 4, 1))
                rgb_color = parseInt(uartData.substr(StrAt + 6, 1))
                rgb_bright = parseInt(uartData.substr(StrAt + 8, 3))
                if (rgb_id != 0) {
			if (rgb_color == 5) {
                            rgb_color = 6
			} else if (rgb_color == 6) {
			    rgb_color = 5
			} else if (rgb_color == 8) {
			    rgb_color = 9
			}
                    newbit_显示类.setPixelRGB(rgb_id - 1, rgb_color)
                    newbit_显示类.setBrightness(rgb_bright * 2.5)
                    newbit_显示类.showLight()
                }
                else {
                    newbit_显示类.clearLight()
                }
                cmdType = CMD_TYPE.LIG;

            }
            else if (uartData.indexOf("col") != -1) {
                StrAt = uartData.indexOf("col")
                color_id = parseInt(uartData.substr(StrAt + 4, 1))
                if (color_id == 1) {
                    if (newbit_传感器类.checkCurrentColor(newbit_传感器类.Colors.Red) == true) {

                        bluetooth.uartWriteString("*@col-1#")
                    }
                    else {

                        bluetooth.uartWriteString("*@col-0#")
                    }
                }
                else if (color_id == 2) {
                    if (newbit_传感器类.checkCurrentColor(newbit_传感器类.Colors.Green) == true) {

                        bluetooth.uartWriteString("*@col-1#")
                    }
                    else {
                        bluetooth.uartWriteString("*@col-0#")

                    }
                }
                else if (color_id == 3) {
                    if (newbit_传感器类.checkCurrentColor(newbit_传感器类.Colors.Blue) == true) {

                        bluetooth.uartWriteString("*@col-1#")
                    }
                    else {
                        bluetooth.uartWriteString("*@col-0#")
                    }
                }
                cmdType = CMD_TYPE.COL;
            }

            else if (uartData.indexOf("ton") != -1) {

                StrAt = uartData.indexOf("ton")
                tone = parseInt(uartData.substr(StrAt + 4, 2))
                dlbot_beat = parseInt(uartData.substr(StrAt + 7, 1))
                //  music.playTone(Tone[tone], Beat[dlbot_beat])
                cmdType = CMD_TYPE.TON;
            }
            else if (uartData.indexOf("ver") != -1) {
                cmdType = CMD_TYPE.VER;
                bluetooth.uartWriteString("*@Microbit_V0#")
            }
            else if (uartData.indexOf("pos") != -1) {
                StrAt = uartData.indexOf("pos")
                show_number = parseInt(uartData.substr(StrAt + 7, uartData.length - StrAt - 7))  /// mark 
                basic.showNumber(show_number)
                cmdType = CMD_TYPE.POS;
            }
			/*
            else if (uartData.indexOf("coo") != -1) {
                StrAt = uartData.indexOf("coo")
                coo_x = parseInt(uartData.substr(StrAt + 4, 2))
                coo_y = parseInt(uartData.substr(StrAt + 7, 2))
                coo_on = parseInt(uartData.substr(StrAt + 10, 1))

                cmdType = CMD_TYPE.COO;
            }
			
            else if (uartData.indexOf("tim") != -1) {
                StrAt = uartData.indexOf("tim")
                hour = parseInt(uartData.substr(StrAt + 4, 2))
                minus = parseInt(uartData.substr(StrAt + 7, 2))
                cmdType = CMD_TYPE.TIM;
            }
			
            else if (uartData.indexOf("mod") != -1) {

                StrAt = uartData.indexOf("mod")
                mode = parseInt(uartData.substr(StrAt + 4, 1))
                cmdType = CMD_TYPE.MOD;
            }
			  else if (uartData.indexOf("che") != -1) {
                StrAt = uartData.indexOf("che")
                pin = parseInt(uartData.substr(StrAt + 4, 1))
                cmdType = CMD_TYPE.CHE;
            }

            else if (uartData.indexOf("ext") != -1) {
                StrAt = uartData.indexOf("ext")
                analog_pin = parseInt(uartData.substr(StrAt + 4, 1))
                cmdType = CMD_TYPE.EXT;
            }
			*/
            else if (uartData.indexOf("sen") != -1) {

                StrAt = uartData.indexOf("sen")
                stringReceive = uartData.substr(StrAt + 4, uartData.length - StrAt - 4)  /// mark
                basic.showString(stringReceive)
                cmdType = CMD_TYPE.SEN;
            }


            else if (uartData.indexOf("tem") != -1) {
                let wendu = input.temperature()
                bluetooth.uartWriteString("*@tem-" + wendu + "#")
                cmdType = CMD_TYPE.TEM;
            }

            else if (uartData.indexOf("sta") != -1) {

                if (newbit_小车类.Line_Sensor(newbit_小车类.enPos.LeftState, newbit_小车类.enLineState.White) && (newbit_小车类.Line_Sensor(newbit_小车类.enPos.RightState, newbit_小车类.enLineState.White))) {
                    bluetooth.uartWriteString("*@sta-0#")
                }
                else if (newbit_小车类.Line_Sensor(newbit_小车类.enPos.LeftState, newbit_小车类.enLineState.White) && (newbit_小车类.Line_Sensor(newbit_小车类.enPos.RightState, newbit_小车类.enLineState.Black))) {
                    bluetooth.uartWriteString("*@sta-1#")
                }
                else if (newbit_小车类.Line_Sensor(newbit_小车类.enPos.LeftState, newbit_小车类.enLineState.Black) && (newbit_小车类.Line_Sensor(newbit_小车类.enPos.RightState, newbit_小车类.enLineState.White))) {
                    bluetooth.uartWriteString("*@sta-2#")
                }
                else if (newbit_小车类.Line_Sensor(newbit_小车类.enPos.LeftState, newbit_小车类.enLineState.Black) && (newbit_小车类.Line_Sensor(newbit_小车类.enPos.RightState, newbit_小车类.enLineState.Black))) {
                    bluetooth.uartWriteString("*@sta-3#")
                }
                cmdType = CMD_TYPE.STA;
            }

            else if (uartData.indexOf("ser") != -1) {

                StrAt = uartData.indexOf("ser")
                dlbot_pos = parseInt(uartData.substr(StrAt + 4, 4))
                dlbot_id = parseInt(uartData.substr(StrAt + 9, 1))
                dlbot_speed = parseInt(uartData.substr(StrAt + 11, 2))
                dlbot_pos = Math.map(dlbot_pos, 0, 1000, 0, 180)
                newbit_小车类.Servo_Car(dlbot_id, dlbot_pos, dlbot_speed)
                cmdType = CMD_TYPE.SERVO_MOVE
            }

            return cmdType
        }
        else {
            return -1
        }
    }
}


