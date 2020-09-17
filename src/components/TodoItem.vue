<template>
    <div>
        <li :key="index">
            <div class="item-left">
                <div class="checkbox" :class="{'checked': item.checked?true:false}" @click="checkOne(item)">
                    <label :for="`#checkbox-${index}`"></label>
                    <input type="checkbox" name="checkes" :id="`checkbox-${index}`" :checked="item.checked" hidden>
                </div>
                <router-link tag="span" :to="{name: 'todoedit', params: { id: item.id }}" class="title" :class="{'done': item.done==1?true:false}" :title="item.title">{{index+1}}. {{item.title}}</router-link>
            </div>
            <div class="btns">
                <div class="btn edit" @click="$emit('editItemChange', item)" v-if="item.done==0">修改</div>
                <div class="btn edit disabled" v-else>修改</div>
                <div class="btn done" @click="doneOne(item)" v-if="item.done==0">完成</div>
                <div class="btn reback" v-else @click="rebackOne(item)">恢复</div>
                <div class="btn del" @click="delOne(item)" v-if="item.isDel==0">删除</div>
            </div>
        </li>
    </div>
</template>

<script>
export default {
    props: ['list','checked_ids','item', 'index'],
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
        checkOne(item){ // 单选
            let ids = this.checked_ids;
            item.checked = !item.checked;
            if( item.checked ){
                ids.push(item);
            }else{
                ids = ids.filter(v => { return v.id != item.id });
            }
            this.$emit('checked_ids_change', ids);
        },
        doneOne(item){
            if(window.confirm('确定完成了？') && item.done==0){
                this.$http.post('/todos/todoDone', this.$qs.stringify({id: item.id})).then(res => {
                    let result = res.data;
                    console.log(res.data.msg);
                    if( result.code == 0 ){
                        item.done = 1;
                        if( this.status != -1 ){
                            item.checked = true;
                        }
                        if( this.status == 2 ){
                            item.checked = false;
                        }
                        this.$emit('checked_ids_change', this.list.filter(itm => { return itm.checked }));
                    }
                })
            }
        },
        delOne(item){
            if(window.confirm('确定删除吗？') && item.isDel==0){
                this.$http.post('/todos/todoDelete', this.$qs.stringify({id: item.id})).then(res => {
                    let result = res.data;
                    console.log(res.data.msg);
                    if( result.code == 0 ){
                        this.$emit('listChange', this.list.filter(itm => { return itm.id != item.id }));
                        this.$emit('checked_ids_change', this.checked_ids.filter(itm => { return itm.id != item.id }));
                    }
                })
            }
        },
        rebackOne(item){
            if(window.confirm('确定恢复吗？') && item.done==1){
                this.$http.post('/todos/todoReback', this.$qs.stringify({id: item.id})).then(res => {
                    let result = res.data;
                    console.log(res.data.msg);
                    if( result.code == 0 ){
                        item.done = 0;
                        this.$emit('checked_ids_change', this.list.filter(itm => { return itm.checked }));
                    }
                })
            }
        }
    },
    activated(){},
    deactivated(){},
    computed: {},
    components: {}
}
</script>

<style scoped lang="">
@import '../../static/css/checkbox';
.checkbox { flex-grow: initial; }
li { padding: 10px; border-bottom: 1px solid #ddd; display: flex; justify-content: space-between; transition: all .8s ease; width: 100%; box-sizing: border-box; }
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
.v-enter, .v-leave-to {
    opacity: 0;
    transform: scale(0);
}
.v-enter-active, .v-leave-active {
    transition: all .5s ease;
}
.v-move {
    transition: all .8s ease;
}
.v-leave-active {
    position: absolute;
    width: 100%;
}
</style>