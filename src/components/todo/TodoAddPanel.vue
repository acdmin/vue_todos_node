<template>
    <div class="add-panel" :class="{'focus': focusClass}">
        <input type="text" class="input-text" v-model="inputText" placeholder="添加个事件?" @focus="inputFocus($event)" @blur="inputBlur($event)" @keyup.enter="addOne">
        <a href="javascript:;" class="add-btn" @click="addOne">添加</a>
    </div>
</template>

<script>
import Utils from '@/utils';
export default {
    props: ['list'],
    data() {
        return {
            inputText: '',
            focusClass: false,
        }
    },
    watch: {
        'inputText': function(){
            if(this.inputText != ''){
                this.checked_ids = [];
                this.status = -1;
                this.$emit('listChange', this.list.map(item => { item.checked = false; return item; }));
            }
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
        inputFocus(e){
            this.focusClass = true;
        },
        inputBlur(e){
            if( this.inputText == '' ){
                this.focusClass = false;
            }
        },
        addOne(){
            if( this.inputText == '' )return
            var params = {
                title: this.inputText
            }
            this.$http.post('/todos/add', this.$qs.stringify(params)).then(res => {
                var result = res.data;
                console.log(result.msg);
                if( result.code == 0 ){
                    let item = result.data;
                    this.inputText = '';
                    item.time = Utils.timeFormate(item.create_time);
                    this.$emit('listChange', this.list.unshift(item));
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
.add-panel { position: fixed; left: 0; top: 50px; width: 100%; height: 70px; display: flex; flex-direction: row; padding: 10px; box-sizing: border-box; }
.add-panel .input-text { font-size: 16px; padding: 0 10px; flex-grow: 1; border: 1px solid #ccc; outline: none; border-top-left-radius: 8px; border-bottom-left-radius: 8px; }
.add-panel .add-btn { padding: 0 20px; background: #ccc; color: #fff; align-items: center; display: flex; text-decoration: none; font-size: 18px; border-top-right-radius: 8px; border-bottom-right-radius: 8px; }
.add-panel.focus .input-text { border-color: red; }
.add-panel.focus .add-btn { background: red; }
</style>