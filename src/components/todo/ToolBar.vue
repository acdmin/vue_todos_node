<template>
    <div class="tool-bar">
        <div class="checks" :class="{'border-red': status==0, 'border-orange': status==1, 'border-blue': status==2, 'border-disabled': !checked_ids.length}">
            <div class="checkbox" :class="{'checked': status==0&&checked_ids.length}" style="margin-left: 5px;" @click="changeCheckStatus(0)" v-if="list.length">
                <label for="#check_status1"></label>{{status==0&&checked_ids.length?'反选':'全选'}}
                <input type="checkbox" id="check_status1" hidden>
            </div>
            <div class="checkbox disabled" :class="{'checked': status==0&&checked_ids.length}" style="margin-left: 5px;" v-else>
                <label for="#check_status1"></label>{{status==0&&checked_ids.length?'反选':'全选'}}
                <input type="checkbox" id="check_status1" hidden>
            </div>

            <div class="checkbox" :class="{'checked': status==1&&checked_ids.length}" style="margin-left: 5px;" @click="changeCheckStatus(1)" v-if="doneAndUndone.done">
                <label for="#change_check_status"></label>已完成
                <input type="checkbox" id="change_check_status" hidden>
            </div>
            <div class="checkbox disabled" style="margin-left: 5px;" v-else>
                <label for="#change_check_status"></label>已完成
                <input type="checkbox" id="change_check_status" hidden>
            </div>

            <div class="checkbox" :class="{'checked': status==2&&checked_ids.length}" style="margin-left: 5px;" @click="changeCheckStatus(2)" v-if="doneAndUndone.undone">
                <label for="#change_check_status"></label>未完成
                <input type="checkbox" id="change_check_status" hidden>
            </div>
            <div class="checkbox disabled" style="margin-left: 5px;" v-else>
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
</template>

<script>
export default {
    props: ['list', 'checked_ids', 'status'],
    data() {
        return {
        }
    },
    beforeCreate(){},
    created(){},
    beforeMount(){},
    mounted(){},
    beforeUpdate(){},
    updated(){},
    beforeDestroy(){},
    destroyed(){},
    methods: {
        changeCheckStatus(status){
            if( !this.list.length ){
                alert('你在逗我?')
                return
            };
            if(this.checked_ids.length){
                this.$emit('checked_ids_change', []);
                if(this.status == status){
                    this.$emit('listChange', this.list.map(item => {
                        item.checked = false;
                        return item;
                    }));
                    return
                }
                this.$emit('listChange', this.list.map(item => {
                    item.checked = false;
                    return item;
                }));
            }
            this.$emit('statusChange', status)
            this.$emit('switchHandle', status)
        },
        // 批量操作 0.批量完成 1.批量恢复 2.批量删除
        batchHandle(status){
            let ids = this.checked_ids.map(item => { return { id: item.id } }),
                params = {
                    batchStatus: status,
                    ids
                }
            switch(status){
                case 0:
                    if(window.confirm('确定批量完成吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            console.log(res.data.msg);
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach(itm => {
                                        if( item.id == itm.id ){
                                            itm.checked = false;
                                            itm.done = 1;
                                        }
                                    })
                                })
                                this.batchHandleReset();
                            }
                        })
                    }
                break;
                case 1:
                    if(window.confirm('确定批量恢复吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            console.log(res.data.msg);
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach(itm => {
                                        if( item.id == itm.id ){
                                            itm.checked = false;
                                            itm.done = 0;
                                        }
                                    })
                                })
                                this.batchHandleReset();
                            }
                        })
                    }
                break;
                case 2:
                    if(window.confirm('确定批量恢复吗？') && this.checked_ids.length){
                        this.$http.post('/todos/betchHandle', params).then(res => {
                            let result = res.data;
                            console.log(res.data.msg);
                            if( result.code == 0 ){
                                this.checked_ids.forEach(item => {
                                    this.list.forEach((itm, idx) => {
                                        if( item.id == itm.id ){
                                            this.list.splice(idx, 1)
                                        }
                                    })
                                })
                                this.batchHandleReset();
                            }
                        })
                    }
                break;
            }
        },
        batchHandleReset(){
            this.$emit('checked_ids_change', []);
            this.$emit('statusChange', -1)
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
            handle.del = true;
            if( checkes.length == done.length && done.length>0 ){
                handle.reback = true;
            }
            if( checkes.length > 0 && done.length==0 ){
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
@import '../../../static/css/checkbox';
.tool-bar { position: fixed; bottom: 0; left: 0; right: 0; height: 50px; display: flex; justify-content: space-between; }
.tool-bar .checks { display: flex; flex-grow: 1; border-top: 1px solid #ccc; justify-content: space-between; }
.tool-bar .checks.border-red { border-color: red; }
.tool-bar .checks.border-orange { border-color: orange; }
.tool-bar .checks.border-blue { border-color: #5691fd; }
.tool-bar .checks.border-disabled { border-color: #ccc; }
.tool-bar .btns { display: flex; width: 140px; }
.tool-bar .btn { background: red; color: #fff; font-size: 14px; display: flex; align-items: center; justify-content: center; flex-grow: 1; }
.tool-bar .btn.del { background: red; }
.tool-bar .btn.reback { background: orange; }
.tool-bar .btn.done { background: #5691fd; }
.tool-bar .btn.disabled { background: #ccc; }
</style>