<template>
    <div>
        <div class="header">Vue - Todos</div>
        <TodoAddPanel :list="list" />
        <div class="todos" id="todos">
            <div>
            <ul v-if="list.length">
                <transition-group>
                <TodoItem :item="item" :index='index' v-for="(item, index) in list" :list="list" :status="status" :checked_ids="checked_ids" @listChange="listChange" @checked_ids_change="checked_ids_change" @editItemChange="editItemChange" @editPanelFlagChange="editPanelFlagChange" :key="item.id" />
                </transition-group>
            </ul>
            <div class="list-empty" v-if="noresult&&!list.length">暂无事件</div>
            <div class="list-empty" v-if="!loadAble&&list.length">就这些了~</div>
            </div>
        </div>
        <ToolBar :list="list" @listChange="listChange" @switchHandle="switchHandle" @statusChange="statusChange" :checked_ids='checked_ids' @checked_ids_change="checked_ids_change" :status="status" />
        <TodoEditPanel :list="list" @listChange="listChange" :editItem="editItem" @editPanelFlagChange="editPanelFlagChange" v-if="editPanelFlag" />
        <Loading :text="'玩命加载中...'" v-if="loading"/>
    </div>
</template>

<script>
import Utils from '@/utils';
import TodoItem from '@/components/TodoItem';
import TodoEditPanel from '@/components/todo/TodoEdit';
import TodoAddPanel from '@/components/todo/TodoAddPanel';
import ToolBar from '@/components/todo/ToolBar';
import Loading from '@/components/Loading';
export default {
    data() {
        return {
            list: [],
            page: {
                page_num: 1,
                page_size: 20,
                page_total: -1
            },
            noresult: false,
            loadAble: true,
            loading: false,
            editItem: null,
            editPanelFlag: false,
            status: -1, // 0 全选/反选 1 已完成 2 未完成
            checked_ids: [],
            //batch: -1 // 0.批量完成 1.批量恢复 2.批量删除
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
                if(this.page.page_total==0)return
                this.getTodoList()
            }
        })
    },
    beforeUpdate(){},
    updated(){},
    beforeDestroy(){},
    destroyed(){},
    methods: {
        listChange(list){
            this.list = list;
        },
        statusChange(status){
            this.status = status;
        },
        checked_ids_change(ids){
            this.checked_ids = [];
            this.checked_ids = ids;
        },
        editPanelFlagChange(){
            this.editPanelFlag = !this.editPanelFlag;
        },
        switchHandle(status){
            switch(status){
                case 0:
                    // 全选/反选
                    this.checked_ids = this.list.map(item => {
                        item.checked = true;
                        return item
                    });
                break;
                case 1:
                    // 已完成
                    this.checked_ids = this.list.filter(item => {
                        if(item.done){
                            item.checked = true;
                            return item;
                        }
                    });
                break;
                case 2:
                    // 未完成
                    this.checked_ids = this.list.filter(item => {
                        if(!item.done){
                            item.checked = true;
                            return item;
                        }
                    });
                break;
            }
        },
        getTodoList(){
            if( !this.loadAble ){
                //console.log('最后一页了')
                return
            }
            this.loading = true;
            setTimeout(() => {// 模拟加载
                this.$http('/todos/getTodoList?page_num='+this.page.page_num + '&page_size=' + this.page.page_size).then(res => {
                    let result = res.data;
                    this.loading = false;
                    if( result.code == 0 ){
                        let data = result.data;
                        this.page.page_total = result.total;
                        if( this.page.page_num == this.page.page_total ){
                            this.loadAble = false;
                        }
                        if( !this.list.length && this.page.page_num == 1 ){
                            this.noresult = true;
                        }
                        if( !this.list.length ){
                            this.list = data.map(item => {
                                item.checked = false
                                item.time = Utils.timeFormate(item.create_time);
                                return item
                            })
                        }else{
                            let _list = data.map(item => {
                                item.checked = false
                                item.time = Utils.timeFormate(item.create_time);
                                return item
                            })
                            this.list = this.list.concat(_list)
                            this.switchHandle(this.status)
                        }
                        this.page.page_num++
                    }
                })
            }, 800);
        },
        editItemChange(todo){
            this.editItem = todo;
            this.editPanelFlagChange();
        }
    },
    activated(){},
    deactivated(){},
    computed: {},
    components: {
        TodoAddPanel,
        TodoEditPanel,
        TodoItem,
        ToolBar,
        Loading
    }
}
</script>

<style scoped lang="">
@import '../../static/css/checkbox';
.header { position: fixed; left: 0; top: 0; right: 0; height: 50px; line-height: 50px; background: red; font-size: 18px; color: #fff; text-align: center; }
.todos { position: fixed; left: 0; right: 0; top: 120px; bottom: 50px; overflow-y: auto; }
ul, li { list-style: none; }
.list-empty { font-size: 16px; color: #ddd; text-align: center; padding: 12px 0; }
</style>