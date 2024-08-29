console.log('PNode');
window.addEventListener('load', async e => {
  const url = new URL(document.location);
  const pathname = url.pathname.substring(1).replace(/^.*pnode\//,'').toCamelCase();
  console.log({url,pathname});
  const path = {
    test(){
      console.log('test');
      $(document.body).append(
        $('div').text('Hello'),
      )
    },
    test2() {
      console.log('test2');
    },
  }
  if (path[pathname]) {
    document.title = pathname.toDisplayName() + ' - Polymac';
    return path[pathname]();
  }
  $(document.body).append(
    $('div').text('Hallo, dit is PNode'),
  )
})