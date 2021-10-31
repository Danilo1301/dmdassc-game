export class DataWatcher {
    private _oldData: any = {};
    private _data: any;

    public processNewData(data: any) {
        this._data = JSON.parse(JSON.stringify(data));

        return this.process();
    }

    private process() {
        //console.log('=== process ===')

    
        const changedData = DataWatcher.compare(this._oldData, this._data);

        //console.log(`oldData= ${JSON.stringify(oldData)}`)
        //console.log(`newData= ${JSON.stringify(newData)}`)
        //console.log(`changedData= ${JSON.stringify(changedData)}`)

        this._oldData = JSON.parse(JSON.stringify(this._data));

        return changedData;
    }

    public static compare(oldData: any, newData: any) {
        
        const changedData = {};
        
        for (const key in newData) {
            
            if(oldData[key] === undefined) {
                changedData[key] = newData[key];
                continue;
            }

            if(typeof newData[key] == 'object') {

                if(Array.isArray(newData[key])) {

                    const oldArrayStrValue = JSON.stringify(oldData[key]);
                    const newArrayStrValue = JSON.stringify(newData[key]);

                    if(oldArrayStrValue != newArrayStrValue) {
                        changedData[key] = newData[key];
                    }
                } else {
                    //console.log("type object", key, newData[key])
                    //console.log('compare', oldData[key], newData[key])

                    let objChangedData = this.compare(oldData[key], newData[key]);
                    objChangedData = this.checkReturnEmpty(objChangedData, undefined);

                    /*
                    console.log(`\n\n`)
                    console.log(`object`)
                    console.log(oldData[key], '\nto\n', newData[key])
                    console.log('\result\n', objChangedData)
                    console.log(`\n\n`)
                    */

                    if(objChangedData !== undefined) changedData[key] = objChangedData;
                }

                continue;
            }

            if(typeof newData[key] == 'number' || typeof newData[key] == 'string') {

                if(oldData[key] != newData[key]) {
                    changedData[key] = newData[key];
                    //console.log('key has changed', key)
                }

                
            }
        }
        
        return this.checkReturnEmpty(changedData, undefined);
    }

    private static checkReturnEmpty(obj: any, valueIfEmpty: any) {
        const keysInObject: string[] = [];
        for (const k in obj) {
            keysInObject.push(k);
        }

        if(keysInObject.length > 0) return obj;
        return valueIfEmpty;
    }
}