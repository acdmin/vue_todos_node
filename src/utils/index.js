export default {
    /**
     * 排序 根据数组的字段排序
     * 如果flag为真 测从大到小排序，反之从小到大，默认为真
     */
    compare(target, flag){
        return function(a, b){
            var value1 = a[target];
            var value2 = b[target];
            return flag?value1 - value2:value2 - value1;
        }
    },
    fillZero(num){
        return num<10?'0'+num:num;
    },
    timeFormate(time){
        return '' + new Date(time).getFullYear() + '/' + this.fillZero((new Date(time).getMonth()+1)) + '/' + this.fillZero(new Date(time).getDate()) + ' ' +this. fillZero(new Date(time).getHours()) + ':' + this.fillZero(new Date(time).getMinutes());
    }
}