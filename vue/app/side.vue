<style lang="less">
    #list{
        margin: 0 4px ;
        li+li{ border-top: 4px solid #fff ;}
        li{  background: rgba(247,105,105,0.4); padding:0.5em ; line-height:1.4; }
        p:first-child{   }
    }
    .fenlei{
        display: flex;
        text-align: center ;
        line-height: 3 ;
        span{
            &.current{ background: blue ; color:#fff; }
            flex: 1 ;
        }
    }
</style>
<template>
    <div>
        <div class="fenlei">
            <span v-for="item in fenleiList"
                  :class="{current:$index==current?true:false}"
                  v-touch:tap="fenleiChange($index, $event)">
                {{item}}
            </span>
        </div>
        <ul id="list">
            <li v-for="item in list" @click="change">
                <p>{{ item.name }}</p>
                <p>{{ item.tag }}</p>
                <span @click.stop="deleteChange($index)">dele</span>
            </li>
        </ul>
    </div>
</template>
<script lang="babel">
    export default{
        props:  ['listStore','current'],
        data(){
            console.log( this )
            return {
                list: [].slice.call(this.listStore[0]) ,
                fenleiList: ['唐诗', '宋词', '元曲']
            }
        },
        methods: {
            change(){
                // list.splice(0,100,...newList)
            },
            deleteChange(index){
               this.$dispatch('deleteChange', index );
            },
            fenleiChange(index, event){
                this.current = index ;
                this.list.splice(0, this.list.length, ...this.listStore[index])
            }
        },
        events: {
            'parent-msg'( index){
                console.log('接受父组件的消息')
                this.fenleiChange( index);
            }
        }
    }
</script>
