<template>
    <div>
        <div class="header">Vue - Todos</div>
        <div class="add-panel" :class="{'focus': focusClass}">
            <input type="text" class="input-text" v-model="inputText" placeholder="添加个事件?" @focus="inputFocus($event)" @blur="inputBlur($event)" @keyup.enter="addOne">
            <a href="javascript:;" class="add-btn" @click="addOne">添加</a>
        </div>
        <div class="todos" id="todos">
            <div>
            <ul v-if="list.length">
                <li v-for="(item, index) in list" :key="index">
                    <div class="item-left">
                        <div class="checkbox" :class="{'checked': item.checked?true:false}" @click="checkOne(item)">
                            <label :for="`#checkbox-${index}`"></label>
                            <input type="checkbox" name="checkes" :id="`checkbox-${index}`" :checked="item.checked" hidden>
                        </div>
                        <router-link tag="span" :to="{name: 'todoedit', params: { id: item._id }}" class="title" :class="{'done': item.done==1?true:false}" :title="item.title">{{index+1}}. {{item.title}}</router-link>
                    </div>
                    <div class="btns">
                        <router-link class="btn edit" :to="{name: 'todoedit', params: { id: item._id }}" v-if="item.done==0">修改</router-link>
                        <div class="btn edit disabled" v-else>修改</div>
                        <div class="btn done" @click="doneOne(item)" v-if="item.done==0">完成</div>
                        <div class="btn reback" v-else @click="rebackOne(item)">恢复</div>
                        <div class="btn del" @click="delOne(item)" v-if="item.isDel==0">删除</div>
                    </div>
                </li>
            </ul>
            <div class="list-empty" v-else>暂无事件</div>
            </div>
        </div>
        <div class="tool-bar">
            <div class="checks" :class="{'border-red': status==0||status==1, 'border-orange': status==2, 'border-disabled': !checked_ids.length}">
                <div class="checkbox" :class="{'checked': checkAll}" style="margin-left: 8px;" @click="changeCheckStatus(0)">
                    <label for="#check_status1"></label>{{checkAll?'反选':'全选'}}
                    <input type="checkbox" id="check_status1" hidden>
                </div>
                <div class="checkbox" :class="{'checked': status==1}" style="margin-left: 8px;" @click="changeCheckStatus(1)" v-if="doneAndUndone.done">
                    <label for="#change_check_status"></label>已完成
                    <input type="checkbox" id="change_check_status" hidden>
                </div>
                <div class="checkbox disabled" style="margin-left: 8px;" v-else>
                    <label for="#change_check_status"></label>已完成
                    <input type="checkbox" id="change_check_status" hidden>
                </div>
                <div class="checkbox" :class="{'checked': status==2}" style="margin-left: 8px;" @click="changeCheckStatus(2)" v-if="doneAndUndone.undone">
                    <label for="#change_check_status"></label>未完成
                    <input type="checkbox" id="change_check_status" hidden>
                </div>
                <div class="checkbox disabled" style="margin-left: 8px;" v-else>
                    <label for="#change_check_status"></label>未完成
                    <input type="checkbox" id="change_check_status" hidden>
                </div>
            </div>
            <div class="btns">
                <div class="btn disabled" v-if="!handleStatus">批量操作</div>
                <template v-else>
                    <div class="btn done" @click="batchHandle(0)" v-if="handleStatus.done">完成</div>
                    <div class="btn reback" @click="batchHandle(1)" v-if="handleStatus.reback">恢复</div>
                    <div class="btn del" @click="batchHandle(2)" v-if="handleStatus.del">删除</div>
                </template>
            </div>
        </div>
        <div class="loading" v-if="loading">玩儿命加载中...</div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            inputText: '',
            focusClass: false,
            list: [],
            page: {
                num: 1,
                size: 15,
                total: 0
            },
            loadAble: true,
            loading: false,
            editIndex: -1,
            status: -1, // 0 全选/反选 1 已完成 2 未完成
            checkAll: false, // 是否已全选
            checked_ids: [],
            batch: -1 // 0.批量完成 1.批量恢复 2.批量删除
        }
    },
    watch: {
        'inputText': function(){
            if(this.inputText != ''){
                this.checked_ids = [];
                this.checkAll = false;
                this.status = -1;
                this.list = this.list.map(item => { item.checked = false; return item; })
            }
        }
    },
    beforeCreate(){},
    created(){},
    beforeMount(){},
    mounted(){
        new fixIosScroll({
            element: document.getElementById('todos'),
            threshold: 50,
            onLoadFn: () => {
                // 操作时，不允许加载
                // console.log(this.status)
                // if( this.status > -1 )return
                this.getTodoList()
            }
        })
    },
    beforeUpdate(){},
    updated(){},
    beforeDestroy(){},
    destroyed(){},
    methods: {
        inputFocus(e){
            this.focusClass = true;
        },
        inputBlur(e){
            if( this.inputText == '' ){
                this.focusClass = false;
            }
        },
        checkOne(item){ // 单选
            item.checked = !item.checked;
            if( item.checked ){
                this.checked_ids.push(item);
            }else{
                this.checked_ids = this.checked_ids.filter(v => { return v._id != item._id })
            }
        },
        changeCheckStatus(status){
            if( !this.list.length ){
                alert('你在逗我?')
                return
            };
            if( this.status == status ){
                this.list = this.list.map(item => {
                    item.checked = false;
                    return item;
                });
                if( this.checkAll ){
                    this.checkAll = false
                }
                this.status = -1;
                return
            }
            this.status = status;
            this.checked_ids = [];
            this.list = this.list.map(item => {
                item.checked = false;
                return item;
            });
            switch(status){
                case 0:
                    // 全选/反选
                    this.checkAll = !this.checkAll;
                    if(this.checkAll){
                        this.checked_ids = this.list.map(item => {
                            item.checked = true;
                            return item;
                        });
                    }else{
                        this.checked_ids = [];
                        this.list.map(item => {
                            item.checked = false;
                        });
                    }
                break;
                case 1:
                    // 已完成
                    this.checkAll = false;
                    this.checked_ids = this.list.filter(item => {
                        if(item.done==1){
                            item.checked = true
                            return item;
                        }
                    })
                break;
                case 2:
                    // 未完成
                    this.checkAll = false;
                    this.checked_ids = this.list.filter(item => {
                        if(item.done==0){
                            item.checked = true
                            return item;
                        }
                    })
                break;
            }
            console.log('bbb')
        },
        getTodoList(){
            if( !this.loadAble ){
                console.log('最后一页了')
                return
            }
            this.loading = true;
            setTimeout(() => {
            this.$http('/todos/getTodoList?page_num='+this.page.num + '&page_size=' + this.page.size).then(res => {
                let result = res.data;
                this.loading = false;
                if( result.code == 0 ){
                    let data = result.data;
                    this.page.total = result.total;
                    if( this.page.num == this.page.total ){
                        this.loadAble = false;
                    }
                    if( !this.list.length ){
                        this.list = data.map(item => {
                            item.checked = false
                            //item.time = '' + new Date(item.create_time).getFullYear() + '/' + (new Date(item.create_time).getMonth()+1) + '/' + new Date(item.create_time).getDate() + ' ' + new Date(item.create_time).getHours() + ':' + new Date(item.create_time).getMinutes()
                            return item
                        })
                    }else{
                        let _list = data.map(item => {
                            item.checked = false
                            return item
                        })
                        this.list = this.list.concat(_list)
                    }
                    this.page.num++
                }
            })
            }, 800);
        },
        doneOne(item){
            if(window.confirm('确定完成了？') && item.done==0){
                this.$http.post('/todos/todoDone', this.$qs.stringify({id: item._id})).then(res => {
                    let result = res.data;
                    if( result.code == 0 ){
                        item.done = 1;
                        if( this.status != -1 ){
                            item.checked = true;
                        }
                        if( this.status == 2 ){
                            item.checked = false;
                        }
                        this.checked_ids = this.list.filter(itm => { return itm.checked })
                        console.log('操作成功');
                    }
                })
            }
        },
        delOne(item){
            if(window.confirm('确定删除吗？') && item.isDel==0){
                this.$http.post('/todos/todoDelete', this.$qs.stringify({id: item._id})).then(res => {
                    let result = res.data;
                    if( result.code == 0 ){
                        this.list = this.list.filter(itm => { return itm._id != item._id })
                        this.checked_ids = this.checked_ids.filter(itm => { return itm._id != item._id })
                        console.log('删除成功');
                    }
                })
            }
        },
        // 批量操作 0.批量完成 1.批量恢复 2.批量删除
        batchHandle(status){
            let ids = this.checked_ids.map(item => { return { _id: item._id } }),
                params = {
                    batchStatus: status,
                    ids
                }
            switch(status){
                case 0:
                    if(window.confirm('确定批量完成吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach(itm => {
                                        if( item._id == itm._id ){
                                            itm.checked = false;
                                            itm.done = 1;
                                        }
                                    })
                                })
                                this.batchHandleReset();
                                console.log(result.msg);
                            }
                        })
                    }
                break;
                case 1:
                    if(window.confirm('确定批量恢复吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach(itm => {
                                        if( item._id == itm._id ){
                                            itm.checked = false;
                                            itm.done = 0;
                                        }
                                    })
                                })
                                this.batchHandleReset();
                                console.log(result.msg);
                            }
                        })
                    }
                break;
                case 2:
                    if(window.confirm('确定批量恢复吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach((itm, idx) => {
                                        if( item._id == itm._id ){
                                            this.list.splice(idx, 1)
                                        }
                                    })
                                })
                                this.batchHandleReset();
                                console.log(result.msg);
                            }
                        })
                    }
                break;
            }
        },
        batchHandleReset(){
            this.checked_ids = [];
            this.status = -1;
            this.checkAll = false;
        },
        rebackOne(item){
            if(window.confirm('确定恢复吗？') && item.done==1){
                this.$http.post('/todos/todoReback', this.$qs.stringify({id: item._id})).then(res => {
                    let result = res.data;
                    if( result.code == 0 ){
                        item.done = 0;
                        if( !this.checkAll ){
                            item.checked = false;
                        }
                        this.checked_ids = this.list.filter(itm => { return itm.checked })
                        console.log('恢复成功');
                    }
                })
            }
        },
        addOne(){
            if( this.inputText == '' )return
            console.log(111)
            var params = {
                title: this.inputText
            }
            this.$http.post('/todos/add', this.$qs.stringify(params)).then(res => {
                var result = res.data;
                if( result.code == 0 ){
                    this.inputText = '';
                    this.list.unshift(result.data);
                    console.log('添加成功');
                }
            })
        }
    },
    activated(){},
    deactivated(){},
    computed: {
        handleStatus(){
            let checkes = [],
                done = [],
                handle = {
                    del: false,
                    reback: false,
                    done: false
                };
            checkes = this.checked_ids;
            done = checkes.filter(item => {
                return item.done==1
            })
            if(!checkes.length)return
            if( checkes.length > done.length && done.length>0 ){
                handle.del = true;
            }
            if( checkes.length == done.length && done.length>0 ){
                handle.reback = true;
            }
            if( checkes.length > 0 && done.length==0 ){
                handle.del = true;
                handle.done = true;
            }
            return handle;
        },
        // 已完成 未完成是否可操作
        doneAndUndone(){
            return {
                done: this.list.some(item => {return item.done}),
                undone: this.list.some(item => {return !item.done})
            }
        }
    },
    components: {}
}
</script>

<style scoped lang="">
.header { position: fixed; left: 0; top: 0; right: 0; height: 50px; line-height: 50px; background: red; font-size: 18px; color: #fff; text-align: center; }
.add-panel { position: fixed; left: 0; top: 50px; width: 100%; height: 70px; display: flex; flex-direction: row; padding: 10px; box-sizing: border-box; }
.add-panel .input-text { font-size: 16px; padding: 0 10px; flex-grow: 1; border: 1px solid #ccc; outline: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
.add-panel .add-btn { padding: 0 20px; background: #ccc; color: #fff; align-items: center; display: flex; text-decoration: none; font-size: 18px; border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
.add-panel.focus .input-text { border-color: red; }
.add-panel.focus .add-btn { background: red; }
.todos { position: fixed; left: 0; right: 0; top: 120px; bottom: 50px; overflow-y: auto; }
ul, li { list-style: none; }
li { padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; }
li .item-left { display: flex; flex-grow: 1; width: 0; }
li .title { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; display: flex; flex-grow: 1; }
li .done { color: #ccc; text-decoration: line-through; }
li .btns { display: flex; align-items: center; justify-content: center; }
li .btns .btn { margin-left: 5px; color: #fff; border-radius: 5px; padding: 4px 8px; text-decoration: none; font-size: 14px; }
li .btns .btn.edit { background: #06a206; }
li .btns .btn.done { background: #5691fd; }
li .btns .btn.del { background: red; }
li .btns .btn.reback { background: orange; }
li .btns .btn.disabled { background: #ccc; }
.list-empty { font-size: 16px; color: #ddd; text-align: center; padding: 10px 0; }

.tool-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 50px; display: flex; justify-content: space-between; }
.tool-bar .checks { display: flex; flex-grow: 1; border-top: 1px solid #ccc; justify-content: space-between; padding-right: 10px; }
.tool-bar .checks.border-red { border-color: red; }
.tool-bar .checks.border-orange { border-color: orange; }
.tool-bar .checks.border-disabled { border-color: #ccc; }
.checkbox { display: flex; flex-direction: row; align-items: center; font-size: 14px; }
.checkbox label { width: 25px; height: 25px; border-radius: 50%; border: 2px solid #ccc; box-sizing: border-box; display: inline-block; margin-right: 8px; position: relative; }
.checkbox.checked { color: red; }
.checkbox.checked label { border-color: red; }
.checkbox.checked label::after { content: ''; position: absolute; left: 5px; width: 18px; height: 8px; border-left: 2px solid red; border-bottom: 2px solid red; transform: rotate(-40deg); border-bottom-left-radius: 3px; }
.checkbox.disabled { color: #ccc; }
.checkbox.disabled label { border-color: #ececec; }
.tool-bar .btns { display: flex; width: 140px; }
.tool-bar .btn { background: red; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-grow: 1; }
.tool-bar .btn.del { background: red; }
.tool-bar .btn.reback { background: orange; }
.tool-bar .btn.done { background: #5691fd; }
.tool-bar .btn.disabled { background: #ccc; }
.loading { padding: 6px 12px; text-align: center; background: rgba(0,0,0,.4); position: fixed; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); z-index: 100; border-radius: 5px; font-size: 12px; color: #fff; }
</style>