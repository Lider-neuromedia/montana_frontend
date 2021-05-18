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
          formData.append(`imagenes[${i}][image]`, element.image);
          formData.append(`imagenes[${i}][destacada]`, element.destacada);
          console.log(element);
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
      formData.append('id_producto', producto.id_producto);
      formData.append('_method', 'PUT');

      const config = { headers: { 'Authorization': `Bearer ${token}` } };
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

async function enviarPedido(pedido, cambiar){
  let formData = new FormData();
  let i = 0;
  let iTienda = 0;
  if(cambiar === "editar"){

  }else{

    try {
      pedido.productos.forEach(element1 => {
        
        formData.append(`productos[${i}][id_producto]`, element1.id_producto);
        console.log(formData.get(`productos[${i}][id_producto]`));
        element1.tiendas.forEach(element2 => {
          formData.append(`productos[${i}][tiendas][${iTienda}][id_tienda]`, element2.id_tienda);
          formData.append(`productos[${i}][tiendas][${iTienda}][cantidad]`, element2.cantidad);
          console.log(formData.get(`productos[${i}][tiendas][${iTienda}][id_tienda]`));
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