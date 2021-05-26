const backend = 'https://pruebasneuro.co/N-1010/montana_backend/public/api';
const token = localStorage.getItem('access_token');

async function enviarData(createSolicitud, cambiar){
    let formData = new FormData();

    if(cambiar === 'editar'){
      try {

        console.log(createSolicitud);

        formData.append('cliente', createSolicitud.cliente);
        formData.append('doc_camara_com', createSolicitud.doc_camara_com);
        formData.append('doc_identidad', createSolicitud.doc_identidad);
        formData.append('doc_rut', createSolicitud.doc_rut);
        formData.append('monto', createSolicitud.monto);
        formData.append('vendedor', createSolicitud.vendedor);
        formData.append('_method', 'PUT');
    
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.post(`${backend}/ampliacion-cupo/${createSolicitud.id_cupo}`, formData, config);
        return response.data;
    
        }catch (error) {
          return error;
        }
    }else{
      try {

        formData.append('cliente', createSolicitud.cliente);
        formData.append('doc_camara_com', createSolicitud.doc_camara_com);
        formData.append('doc_identidad', createSolicitud.doc_identidad);
        formData.append('doc_rut', createSolicitud.doc_rut);
        formData.append('monto', createSolicitud.monto);
        formData.append('vendedor', createSolicitud.vendedor);
    
        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.post(`${backend}/ampliacion-cupo`, formData, config);
        return response.data;
    
        }catch (error) {
          return error;
        }
    }

    
  }

  async function enviarCatalogo(catalogo, cambiar){
      let formData = new FormData();
      
      

    if(cambiar === 'editar'){
      console.log(catalogo);
      
      if(catalogo.image){
        formData.append('imagen', catalogo.image);
        console.log(formData.get('imagen'));
      }else{
        formData.append('imagen', "");
        console.log(formData.get('imagen'));
      }

      try {
        formData.append('descuento', catalogo.descuento);
        formData.append('estado', catalogo.estado);
        formData.append('titulo', catalogo.titulo);
        formData.append('tipo', catalogo.tipo);
        formData.append('etiqueta', catalogo.etiqueta);
        formData.append('id_catalogo', catalogo.id_catalogo);
        formData.append('_method', 'PUT');

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.post(`${backend}/catalogos/${catalogo.id_catalogo}`, formData, config);
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log(error);
        return error;
    }
    }else{
    try {

        formData.append('descuento', catalogo.descuento);
        formData.append('estado', catalogo.estado);
        formData.append('image', catalogo.image);
        formData.append('nombre', catalogo.nombre);
        formData.append('tipo', catalogo.tipo);
        formData.append('etiqueta', catalogo.etiqueta);

        const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.post(`${backend}/catalogos`, formData, config);
        console.log(response.data);
        return response.data;

    } catch (error) {
        console.log(error);
        return error;
    }
  }
}

async function enviarProducto(producto, cambiar){
  let formData = new FormData();
  let i = 0;
  if(cambiar === 'editar'){
    try {
      producto.imagenes.forEach(element => {
        if(element.image.type){
          formData.append(`imagenes[${i}][image]`, element.image);
          formData.append(`imagenes[${i}][destacada]`, element.destacada);
          formData.append(`imagenes[${i}][id_galeria_prod]`, element.id_galeria_prod)
        }else{
          formData.append(`imagenes[${i}][image]`, '');
          formData.append(`imagenes[${i}][destacada]`,   element.destacada);
        }
          console.log(element);
        i++;
      });
      
      formData.append('catalogo', producto.catalogo);
      formData.append('codigo', producto.codigo);
      formData.append('descripcion', producto.descripcion);
      formData.append('marca', producto.marca);
      formData.append('nombre', producto.nombre);
      formData.append('precio', producto.precio);
      formData.append('referencia', producto.referencia);
      formData.append('stock', producto.stock);
      formData.append('id_producto', producto.id_producto);
      formData.append('_method', 'PUT');

      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      for (const [name, value] of formData) {
        console.log(`${name} = ${value}`);
      }
        const response = await axios.post(`${backend}/producto/${producto.id_producto}`, formData, config);
        console.log(response.data);
        return response.data;
      } catch (error) {
        console.log(error);
        return error;
      }
  }else{
    try {
      producto.imagenes.forEach(element => {
        formData.append(`imagenes[${i}][image]`, element.image);
        formData.append(`imagenes[${i}][destacada]`, element.destacada);
        i++;
      });
      console.log(producto);
      formData.append('catalogo', producto.catalogo);
      formData.append('codigo', producto.codigo);
      formData.append('descripcion', producto.descripcion);
      formData.append('marca', producto.marca);
      formData.append('nombre', producto.nombre);
      formData.append('precio', producto.precio);
      formData.append('referencia', producto.referencia);
      formData.append('stock', producto.stock);

      const config = { headers: { 'Authorization': `Bearer ${token}` } };
        const response = await axios.post(`${backend}/productos`, formData, config);
        console.log(response.data);
        return response.data;

    } catch (error) {
      console.log(error);
      return error;
    }
  }
}
// function base64ToFile(url, filename){
//   let arr = url.split(','),
//       mime = arr[0].match(/:(.*?);/)[1],
//       bstr = atob(arr[1]),
//       n = bstr.length,
//       u8arr = new Uint8Array(n);

//       while(n--){
//         u8arr[n] = bstr.charCodeAt(n);
//       }
//       return new File([u8arr], filename, {type:mime});
// }
// function getBase64Image(index) {
//   let canvas = document.getElementById('canvas0');
//   let img = document.getElementById('img0');
//   let ctx = canvas.getContext("2d");
//   console.log(img.src);
//   ctx.drawImage(img, 0, 0);
//   let dataURL = canvas.toDataURL("image/png");
//   console.log(dataURL);
//   return dataURL;
// }

async function enviarPedido(pedido, cambiar){
  let formData = new FormData();
  let i = 0;
  let iTienda = 0;
  if(cambiar === "editar"){
    try {
      pedido.productos.forEach(element1 => {
        formData.append(`productos[${i}][producto]`, element1.producto);
        formData.append(`productos[${i}][stock]`, element1.stock);
        element1.tiendas.forEach(element2 => {
          formData.append(`productos[${i}][tiendas][${iTienda}][cantidad_producto]`, element2.cantidad_producto);
          formData.append(`productos[${i}][tiendas][${iTienda}][id_pedido_prod]`, element2.id_pedido_prod);
          iTienda++;
        });
        i++;
      });
      formData.append('id_pedido', pedido.id_pedido);
      formData.append('metodo_pago', pedido.metodo_pago);
      formData.append('total', pedido.total);
      formData.append('firma', '');

      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      for (const [name, value] of formData) {
        console.log(`${name} = ${value}`);
      }
        const response = await axios.post(`${backend}/update-pedido`, formData, config);
        console.log(response.data);
        return response.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }else{

    try {
      pedido.productos.forEach(element1 => {
        
        formData.append(`productos[${i}][id_producto]`, element1.id_producto);
        console.log(formData.get(`productos[${i}][id_producto]`));
        element1.tiendas.forEach(element2 => {
          if(element2.cantidad > 0){
            formData.append(`productos[${i}][tiendas][${iTienda}][id_tienda]`, element2.id_tienda);
            formData.append(`productos[${i}][tiendas][${iTienda}][cantidad]`, element2.cantidad);
            console.log(formData.get(`productos[${i}][tiendas][${iTienda}][id_tienda]`));
          }
          iTienda++;
        });
        i++;
      });
      
  
      formData.append('cliente', pedido.cliente);
      formData.append('vendedor', pedido.vendedor);
      formData.append('codigo_pedido', pedido.codigo_pedido);
      formData.append('descuento', pedido.descuento);
      formData.append('total_pedido', pedido.total_pedido);
      formData.append('firma', pedido.firma);
      formData.append('forma_pago', pedido.forma_pago);

      const config = { headers: { 'Authorization': `Bearer ${token}` } };
      for (const [name, value] of formData) {
        console.log(`${name} = ${value}`);
      }
        const response = await axios.post(`${backend}/pedidos`, formData, config);
        console.log(response.data);
        return response.data;

    } catch (error) {
      console.log(error);
      return error;
    }
  
  }
}

function ordenarProductosMayor(productos){
  return productos.sort(function(a, b){
    if(a.precio < b.precio){
      return 1;
    }
    if(a.precio > b.precio){
      return -1;
    }
    return 0;
  })
}
function ordenarProductosMenor(productos){
  return productos.sort(function(a, b){
    if(a.precio > b.precio){
      return 1;
    }
    if(a.precio < b.precio){
      return -1;
    }
    return 0;
  })
}
function ordenarProductosStock(productos){
  return productos.sort(function(a, b){
    if(a.stock < b.stock){
      return 1;
    }
    if(a.stock > b.stock){
      return -1;
    }
    return 0;
  })
}