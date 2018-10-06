var cont = 0; // ponemos un contador que arranca en cero, cada vez que hago una accion le suma uno , y seteo que el contador sea menos a dos (en la funccion), porque quiero tener un maximo de dos cartas dadas vuelta
var intentos = 0;
var maxIntentos;
var paresEncontrados = 0; // creo un var con pares encontrados en cero para ir sumando a medida que encuentra uno igual, maximo 6, para determinar si gano
var imgOrden = [
  "img/alce.jpg",
  "img/alce.jpg",
  "img/epelante.jpg",
  "img/epelante.jpg",
  "img/nena.jpg",
  "img/nena.jpg",
  "img/peces.jpg",
  "img/peces.jpg",
  "img/unichancho.jpg",
  "img/unichancho.jpg",
  "img/zapas.jpg",
  "img/zapas.jpg"
];
let imgDesorden = random(imgOrden);
//estructura de mi primer ficha
var primerCarta = {
  data: "",
  id: null
};
var nombre = $("#su-nombre").focus();

//boton comenzar
$(".comenzar").on("click", function () {
  if ($("#su-nombre").val() == "") {
    var nombrerequerido = $("#requerido").removeClass("none");
    setTimeout(function () {
      nombrerequerido.addClass("none");
    }, 2000);
  } else {
    $("#su-nombre").removeClass("nombre-vacio");
    $(".juego").removeClass("none");
    $(".jugador").addClass("none");
    var nombre = $("#su-nombre").val();
    var inputNombre = $("#nombre").append(nombre);
  }
});

//dificultades del juego
$("#facil").on("click", function () {
  maxIntentos = 18;
  var dificultad = "FACIL";
  $(".intentos-juego").append(maxIntentos);
  $(".dificultad").append(dificultad);
});

$("#intermedio").on("click", function () {
  maxIntentos = 12;
  var dificultad = "INTERMEDIO";
  $(".intentos-juego").append(maxIntentos);
  $(".dificultad").append(dificultad);
});

$("#experto").on("click", function () {
  maxIntentos = 9;
  var dificultad = "DIFICIL";
  $(".intentos-juego").append(maxIntentos);
  $(".dificultad").append(dificultad);
});

//randomizamos el array de img ordenada
function random(a) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

//le agregamos a cada elemento del html un data con la img randomizada
for (var i = 0; i < imgDesorden.length; i++) {
  $(".div-img") // es una array
    .eq(i) //es este elemento de esta array
    .children("img") //llamo al hijo
    .attr("data-destapada", imgDesorden[i]); //creame un atributo que sea "data-destapada" con este valaor = imgDesorden[i]
}

//click de cada img
$("img").on("click", function () {
  $(this).effect("fade", "slow");
  if (
    cont < 2 &&
    intentos < maxIntentos &&
    primerCarta.id != $(this)[0].id &&
    !$(this).hasClass("same")
  ) {
    $(this).addClass("rotar");
    $(this).attr("src", $(this).data("destapada")); //meteme en el src el segundo valor que escribimos , $(this).data("destapada") sale del for
    // porque todavia no hicimos ningun click
    if (primerCarta.data == "") {
      $(this).addClass("rotar");
      //data que sea el valor del data de la img que muestra
      primerCarta.data = $(this).data("destapada");
      primerCarta.id = $(this)[0].id; // y ponele el id que esa img tiene
      cont++;
    } else {
      $(this).addClass("rotar");
      if (primerCarta.data == $(this).data("destapada")) {
        //segunda carta, si es igual al mismo valor que le puse antes, entonces son iguales
        $("#" + primerCarta.id).addClass("same color"); //agrego una clase para que no me deje dal vuelta una que ya di vuelta
        $(this).addClass("same color");
        primerCarta = {
          // volvemos a setear la primer carta en cero, para que podamos volver a entrar en le funcion
          data: "",
          id: null
        };
        cont = 0;
        intentos++;
        $(".intentos").html(intentos);
        paresEncontrados++;
      } else {
        // si no tienene el mismo data, son distintas
        const that = $(this); //guardo en un var el click actual, porque al entrar en la siguiente funcion me pierde el click
        setTimeout(function () {
          that.attr("src", "img/tapada.jpg"); //entonces a la segunda que le hice click le pongo el src del logo (tapado)
          $("#" + primerCarta.id).attr("src", "img/tapada.jpg"); //tapamos la primer carta, pidiendole el id y cambiandole el src nuevamente
          $("#" + primerCarta.id).removeClass("rotar");
          that.removeClass("rotar");
          primerCarta = {
            // volvemos a setear la primer carta en cero, para que podamos volver a entrar en le funcion
            data: "",
            id: null
          };
          cont = 0;
        }, 1000);
        cont++;
        intentos++;
        $(".intentos").html(intentos)

      }
    }
  }

  if (intentos >= maxIntentos) {
    $("#juego").addClass("opacidad");
    $("#perdiste").removeClass("none");
    $("img").unbind("click");
    leerDatos();
  }
  if (intentos <= maxIntentos && paresEncontrados == 6) {
    $("#juego").addClass("opacidad");
    $("#ganaste").removeClass("none");
    $("img").unbind("click");
    guardarDatos();
    leerDatos();
  }
});

$(".reiniciar").on("click", function () {
  window.location.reload(true);
});

function leerDatos() {
  var datosGuardados = JSON.parse(localStorage.getItem("info"));
  if (datosGuardados) {
    for (var i = 0; i < datosGuardados.info.length; i++) {
      var nombreG = "<p>" + datosGuardados.info[i].nombre + "</p>";
      var dificultadG = "<p>" + datosGuardados.info[i].dificultad + "</p>";
      var intentosG = "<p>" + datosGuardados.info[i].intentos + "</p>";
      $(".nombre-guardado").append(nombreG);
      $(".dificultad-guardado").append(dificultadG);
      $(".intentos-guardado").append(intentosG);
    }
  }
}

function guardarDatos() {
  var jsonInfo;
  var info;

  var datosGuardados = localStorage.getItem("info");

  if (datosGuardados == null) {
    info = [];
  } else {
    info = JSON.parse(datosGuardados).info;
  }

  let data = {
    nombre: $("#su-nombre").val(),
    dificultad: $(".dificultad").html(),
    intentos: $(".intentos").html()
  };

  info.push(data);

  infoOrdenado = info.sort((a, b) => a.intentos - b.intentos);

  jsonInfo = {
    info: infoOrdenado,
    total: infoOrdenado.length
  };

  console.log(123)
  let dataStr = JSON.stringify(jsonInfo);
  localStorage.setItem("info", dataStr);
}
