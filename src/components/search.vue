<template>
  <div id="continer">
    <div style="width: 100vw;height: 10vh;">
      <Icon type="md-settings" color="grey" size="25" id="setting-icon" @click="drawer = true"/>
      <Drawer :closable="false" v-model="drawer" width="220" title="设置">
        <List :split="false">
          <ListItem>
            <span>小伙伴上线提醒</span>
            <i-switch v-model="userOnlineNotice" true-value="1" false-value="0" @on-change="setOnlineNotice" style="position:absolute;right:0;"/>
          </ListItem>
        </List>
      </Drawer>
    </div>
    <div id="search_input_div">
      <h1 id="title">Api Wiki</h1>
      <Select clearable size="large" @keyup.enter.native="detail" placeholder="请输入接口名..." v-model="searchVal" filterable>
        <Option v-for="(option, index) in items" :value="option.name" :key="index">{{option.name}}</Option>
      </Select>
      <br><br>
      <List header="搜索历史" border v-if="search_history">
        <ListItem v-for="(item, index) in historyFilter" :key="index">
          <a @click="toDetail(item.api)">{{ item.api }}</a>
          <Time :time="item.time" style="position:absolute;right:24px;color: #9ea7b4"/>
        </ListItem>
      </List>
    </div>
    <div style="width: 100%;height: 40px;line-height: 40px;position:fixed; bottom:0;text-align: center">
      <span v-if="onlineCount > 0" style="color: #9ea7b4">
        当前 {{onlineCount}} 人在线
      </span>
    </div>
  </div>
</template>

<script>
import axios from 'axios'

export default {
  name: 'search',
  data () {
    return {
      searchVal: '',
      items: [],
      search_history: null,
      drawer: false,
      userOnlineNotice: 0
    }
  },
  props: {
    onlineCount: Number
  },
  created () {
    this.$emit('onNoticeVal', this.getOnlineNotice())
    this.init()
  },
  computed: {
    historyFilter () {
      return this.search_history.filter(function (item, index) {
        return index < 5
      })
    }
  },
  methods: {
    init () {
      let history = localStorage.getItem('search_history')
      if (history !== 'undefined' && history !== null) {
        history = JSON.parse(history)
        this.search_history = history.reverse()
      }
      axios.get('/oapi/list')
        .then((response) => {
          this.items = response.data
        }).catch(error => {
          console.log('yyyyyyy' + error)
        }).finally(() => {})
    },

    detail: function () {
      this.$router.push({name: 'Wiki', params: {name: this.searchVal}})
    },
    toDetail: function (api) {
      this.searchVal = api
      this.detail()
    },
    setOnlineNotice () {
      this.$emit('onNoticeVal', this.userOnlineNotice)
      localStorage.setItem('userOnlineNotice', this.userOnlineNotice)
      this.$Message.success('操作成功')
    },
    getOnlineNotice () {
      let userOnlineNotice = localStorage.getItem('userOnlineNotice')
      if (userOnlineNotice === 'undefined' || userOnlineNotice === null) {
        userOnlineNotice = 0
      }
      return userOnlineNotice
    }
  }
}
</script>

<style scoped>
  body {
    overflow-y : hidden;
  }

  #search_input_div {
    width: 40%;
    padding-top: 5%;
    margin: 0 auto;
  }

  #title {
    color: dodgerblue;
    text-align: center;
    padding-bottom: 35px;
    letter-spacing:1px;
  }

  #continer {
    width: 100vw;
    height: 100vh;
    padding: 0;
    margin: 0;
    background-image: url("../assets/background.svg");
  }

  #setting-icon {
    line-height: 10vh;float: right;margin-right: 16px;
  }

  @media only screen and (max-width: 500px) {
    #search_input_div {
      width: 90%;
      padding-top: 2%;
    }
    #title {
      padding-bottom: 15px;
    }
  }
</style>
