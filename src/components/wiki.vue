<template>
  <div class="layout">
  <Layout>
    <Content :style="{padding: '0 16px 16px',marginTop: '20px'}">
      <Row>
        <Col :xs="24" :sm="{span: 20, offset: 2}">
          <Breadcrumb :style="{margin: '16px 0'}">
            <BreadcrumbItem><router-link to="/">Home</router-link></BreadcrumbItem>
            <BreadcrumbItem>Wiki</BreadcrumbItem>
            <BreadcrumbItem>{{search_name}}</BreadcrumbItem>
          </Breadcrumb>
          <Card v-if="loading" class="spin-container">
            <Spin size="large" fix></Spin>
          </Card>
          <Card v-else>
            <template v-if="response_data">
                  <div class="ivu-anchor data-div">
                    <h2 :style="{marginBottom: '10px'}"><Icon type="ios-link" color="#2d8cf0" />  接口地址
                      <Tooltip content="安全起见，只展示 API 相对路径" placement="right">
                        <Icon type="md-help-circle" color="grey"/>
                      </Tooltip>
                    </h2>
                    <div style="text-align: left;margin: 30px 0px 0px 30px"><b>{{ real_api }}</b></div>
                  </div>
                  <br>
                  <div class="data-div">
                    <h2 :style="{marginBottom: '10px',marginLeft: '10px'}"><Icon type="md-code" color="#2d8cf0" />  请求参数</h2>
                    <Table border :columns="request_columns" :data="request_data"></Table>
                  </div>
                  <br>

                  <div class="data-div">
                    <h2 :style="{marginBottom: '10px',marginLeft: '10px'}"><Icon type="md-code" color="#2d8cf0" />  返回数据</h2>
                    <Table border :columns="request_columns" :data="response_data"></Table>
                  </div>
                  <br>

                  <div v-for="(item, key) in child_data" v-bind:key="key" class="data-div" v-if="child_data">
                    <h2 :style="{marginBottom: '10px',marginLeft: '10px'}"><Icon type="md-code" color="#2d8cf0" />
                      <a :name="key">{{key}}</a></h2>
                    <Table border :columns="request_columns" :data="item"></Table>
                  </div>

                  <div class="endLine">
                    <Divider size="small"><span style="color: #c5c8ce">END</span></Divider>
                  </div>

                </template>
              <template v-else>
                <div class="spin-container">
                  <div class="error-img"></div>
                  <div class="error-title"><span>(￣O￣!) 哦豁～这个文档有点问题</span></div>
                </div>
            </template>
          </Card>
          <BackTop></BackTop>
        </Col>
      </Row>
    </Content>
  </Layout>
  </div>
</template>

<script>
import axios from 'axios'
import vue from 'vue'

let typeMap = ['string', 'int', 'integer', 'double', 'float', 'bool']

export default {
  name: 'wiki',
  data () {
    return {
      loading: true,
      real_api: null,
      request_data: null,
      response_data: null,
      child_data: {},
      request_columns: [
        {
          title: '参数名',
          key: 'var_name',
          align: 'center',
          render: (h, params) => {
            return h('h4', params.row.var_name)
          }
        },
        {
          title: '类型',
          key: 'type',
          align: 'center',
          render: (h, params) => {
            if (typeMap.indexOf(params.row.type) >= 0) {
              return h('h4', params.row.type)
            } else if (params.row.type === 'Array' && typeMap.indexOf(params.row.child_attr) >= 0) {
              return h('h4', params.row.type + '<' + params.row.child_attr + '>')
            } else {
              return h('h4', [
                params.row.type,
                h('a', {
                  attrs: {
                    href: '#' + params.row.child_attr
                  }
                  // on: {
                  //   click: () => {
                  //     this.anchorJump('#' + params.row.child_attr)
                  //   }
                  // }
                },
                '<' + params.row.child_attr + '>')
              ])
            }
          }
        },
        {
          title: '说明',
          key: 'comment',
          align: 'center',
          render: (h, params) => {
            return h('h4', params.row.comment)
          }
        }
      ],
      search_name: this.$route.params.name || sessionStorage.getItem('current_api')
    }
  },

  created () {
    this.init()
  },

  methods: {
    init () {
      axios
        .post('/api/GetApiDocs', {'api_name': this.search_name})
        .then((response) => {
          if (response.status === 200) {
            sessionStorage.setItem('current_api', this.search_name)
            this.insertSearchRecord(this.search_name)
          }

          this.real_api = response.data.real_api
          this.request_data = response.data.request
          this.response_data = response.data.response
          this.getChildData(this.request_data)
          this.getChildData(this.response_data)
        })
        .catch(
          error => {
            console.log(error)
          })
        .finally(() => { this.loading = false })
    },

    getChildData (data) {
      let this_ = this
      data.map(function (item) {
        if (item.child_attr && typeMap.indexOf(item.child_attr) < 0) {
          vue.set(this_.child_data, item.child_attr, item.child_vars)
          this_.getChildData(item.child_vars)
        }
      })
    },

    insertSearchRecord (apiName) {
      var history = localStorage.getItem('search_history')
      if (history !== 'undefined' && history !== null) {
        history = JSON.parse(history)
        history.forEach((item, index) => {
          if (item.api === apiName) {
            history.splice(index, 1)
          }
        })
        var newRecord = {'api': apiName, 'time': (new Date()).getTime()}
        history.push(newRecord)
        localStorage.setItem('search_history', JSON.stringify(history))
      } else {
        var initHistory = [{'api': apiName, 'time': (new Date()).getTime()}]
        localStorage.setItem('search_history', JSON.stringify(initHistory))
      }
    }
  }
}
</script>

<style scoped>
  .layout{
    border: 1px solid #d7dde4;
    background: #f5f7f9;
    position: relative;
    border-radius: 4px;
    overflow: hidden;
  }
  /*.layout-header-bar{*/
  /*  background: #fff;*/
  /*  box-shadow: 0 1px 1px rgba(0,0,0,.1);*/
  /*}*/

  .spin-container{
    display: inline-block;
    width: 100%;
    height: 600px;
    position: relative;
  }

  .error-title {
    margin: 10px auto;
    width: 50vw;
    height: 10vh;
    text-align: center;
    font-size: 20px;
    color: #8391a5;
  }

  .error-img {
    margin: 10% auto;
    margin-bottom: 0px;
    width: 60vw;
    height: 50vh;
    background-image: url("../assets/error-500.svg") ;
    background-size: 100% 100%;
  }

  .endLine {
    height: auto;width: 85%;margin: 45px auto;
  }
  .data-div {
    height: auto;width: 85%;margin: 20px auto;
  }

  @media only screen and (max-width: 500px) {
    .endLine {
      margin: 20px auto;
    }
    .data-div {
      width: 100%;margin: 10px auto;
    }
  }
</style>
