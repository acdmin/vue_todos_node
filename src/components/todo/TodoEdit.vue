<template>
    <div>
        <div class="edit-panel">
            <h4>事件修改</h4>
            <input class="input-text" type="text" v-model.trim="title" @keyup.enter="editSave">
            <a href="javascript:;" class="input-btn" @click="editSave">保存修改</a>
        </div>
        <div class="mask" @click="$emit('editPanelFlagChange')"></div>
    </div>
</template>

<script>
import Utils from '@/utils';
export default {
    name: 'edit',
    props: ['list', 'editItem'],
    data() {
        return {
            id: -1,
            title: ''
        }
    },
    beforeCreate(){},
    created(){
        this.id = this.editItem.id;
        this.title = this.editItem.title;
    },
    beforeMount(){},
    mounted(){},
    beforeUpdate(){},
    updated(){},
    beforeDestroy(){},
    destroyed(){},
    methods: {
        editSave(todo){
            var params = {
                id: this.id,
                title: this.title
            }
            this.$http.post('/todos/todoEdit', this.$qs.stringify(params)).then(res => {
                var result = res.data;
                console.log(result.msg);
                if( result.code == 0 ){
                    this.$nextTick(()=>{
                        //排序
                        let arr = this.list.map((item, index) => {
                            if( item.id == this.id ){
                                item.title = result.data.title;
                                item.create_time = result.data.create_time;
                                item.time = Utils.timeFormate(result.data.create_time);
                                item.checked = false;
                            }
                            return item;
                        }).sort(Utils.compare('create_time'));
                        this.$emit('listChange', arr);
                        this.$emit('editPanelFlagChange');
                    })
                }
            })
        }
    },
    activated(){},
    deactivated(){},
    computed: {},
    components: {}
}
</script>

<style scoped lang="">
.edit-panel { position: fixed; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); z-index: 20; border: 2px solid #ccc; background: #fff; border-radius: 5px; padding: 10px 15px; width: 70%; display: flex; flex-direction: column; align-items: center; }
.edit-panel h4 { text-align: center; padding-bottom: 10px; }
.edit-panel .input-text { font-size: 16px; color: #222; text-align: center; height: 26px; line-height: 26px; border: 1px solid #ccc; margin: 6px 0 15px; }
.edit-panel .input-btn { padding: 6px 5px; border-radius: 3px; text-decoration: none; background: #666; font-size: 14px; color: #fff; text-align: center; width: 100px; }
.edit-panel {}
.edit-panel {}
.mask { position: fixed; left: 0; top: 0; right: 0; bottom: 0; background: rgba(0,0,0,.45); z-index: 18; }
</style>