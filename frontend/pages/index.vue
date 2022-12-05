<template>
  <section>
    <h1>Hello WOrld!</h1>

    <v-card>
      <v-card-title>
        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="books"
        :search="search"
      ></v-data-table>
    </v-card>
  </section>
</template>

<script>
export default {
  name: 'IndexPage',
  data() {
    return {
      search: '',
      headers: [
        {
          text: 'Title',
          align: 'start',
          value: 'title',
        },
        { text: 'Author', value: 'author' },
        { text: 'Image Link', value: 'imageLink' },
        { text: 'Publishing Date', value: 'publishDate' },
        { text: 'Language', value: 'language' },
        { text: 'Link', value: 'link' },
        { text: 'Pages', value: 'pages' },
        { text: 'Status', value: 'status' },
      ],
    }
  },
  async asyncData ({ $axios }) {
    const response = await $axios.get(`http://localhost:8080/book/getAll`)
    console.log(response.data.data)
    return {books: response.data.data}
  }
}
</script>
