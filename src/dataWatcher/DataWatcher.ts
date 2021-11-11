export class DataWatcher {

    
    private _data: any;

    private _oldData: any = {};
    private _newData: any = {};

    constructor(data: any) {
        this._data = data;
    }

    public getNewData() {
        return this._newData;
    }

    public process() {
        this._newData = {};

        var newData = this.compare(this._oldData, this._data);
        DataWatcher.mergeData(this._oldData, newData);

        this._newData = newData;
    }

    public test(str: string) {
        //console.log(`------Begin test ${str} ----`)
        this.process();
        //console.log(`------End test ${str} ----`)
    }

    public compare(oldData, newData) {
        let changedData = {};
   
        for (const key in newData) {

            //console.log(`[DataWatcher] Checking key '${key}' (${typeof newData[key]}) (old: ${oldData[key]}; new ${newData[key]})`);

            const isArray = newData[key].length >= 0;

            if(typeof newData[key] == "object" && !isArray) {

                if(!oldData[key]) oldData[key] = {};

                var res = this.compare(oldData[key], newData[key]);
                
                let keysNum = 0;
                for (const key in res) keysNum++;

                if(keysNum > 0) {
                    changedData[key] = {};
                    DataWatcher.mergeData(changedData[key], res);
                }

                continue;
            }


            if(isArray) {

                if(JSON.stringify(oldData[key]) != JSON.stringify(newData[key])) {
                    //console.log(`[DataWatcher] Array '${key}' changed`);
                    changedData[key] = JSON.parse(JSON.stringify(newData[key]));
                }
            } else {
                if(oldData[key] != newData[key]) {
                    //console.log(`[DataWatcher] '${key}' changed`);
                    changedData[key] = newData[key];
                }
            }

           
            
        }

        //console.log('changedData', changedData)

        return changedData;

        //this.mergeData(oldData, changedData)

        return;
    }

    public static mergeData(target, data) {

        if(target == undefined) {
            console.log("heh?", target, data)
        }

        //console.log('put data, target:', target, 'data', data)

        for (const key in data) {


            if(typeof data[key] == 'object') {
                
                const isArray = data[key].length != undefined;

                if(isArray) {

                    //console.log('isarray')

                    target[key] = JSON.parse(JSON.stringify(data[key]));
                } else {

  
                    if(!target[key]) target[key] = {};

                    this.mergeData(target[key], data[key])
                }

                continue;
            }

            //console.log(target, key, data)

            try {
                

                target[key] = data[key];
            } catch (error) {
                console.log(`[err]`, target, data, key)
            }

            
            //console.log(`[DataWatcher : putData] ${key}`)
        }
    }


    public hasNewData() {
        const data = this.getNewData();
        let n = 0;
        for (const key in data) n++;
        return n > 0;
    }
}