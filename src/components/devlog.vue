<script>
export default {
  name: 'devlog',
  data () {
    return {
      a: 10
    }
  },
  render: (h) => {
    return h('div', {
      style: {
        width: '90%',
        height: '500px',
        background: '#366753',
        margin: '0px auto'
      },
      attrs: {
        id: 'mydiv'
      },
      props: {
        myProp: 'bar'
      }
    }, [
      'abc',
      h('a', 'de')
    ])
  }
}
</script>
