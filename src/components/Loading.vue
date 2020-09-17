<template>
    <div class="loading">{{text}}</div>
</template>

<script>
export default {
    props: ['text'],
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
    methods: {},
    activated(){},
    deactivated(){},
    computed: {},
    components: {}
}
</script>

<style scoped lang="">
.loading { padding: 6px 12px; text-align: center; background: rgba(0,0,0,.4); position: fixed; left: 50%; top: 50%; transform: translateX(-50%) translateY(-50%); z-index: 100; border-radius: 5px; font-size: 12px; color: #fff; }
</style>