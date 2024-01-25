import { ref, onMounted, onBeforeUnmount } from "vue";

const nuxtApp = useNuxtApp();

export const useQuaggaScanRectangle = () => {
  function calculateRectFromArea(canvas, area) {
    var canvasWidth = canvas.width,
      canvasHeight = canvas.height,
      top = parseInt(area.top) / 100,
      right = parseInt(area.right) / 100,
      bottom = parseInt(area.bottom) / 100,
      left = parseInt(area.left) / 100;

    top *= canvasHeight;
    right = canvasWidth - canvasWidth * right;
    bottom = canvasHeight - canvasHeight * bottom;
    left *= canvasWidth;

    return {
      x: left,
      y: top,
      width: right - left,
      height: bottom - top,
    };
  }

  onMounted(() => {
    console.log("composable work");
    nuxtApp.$Quagga.onProcessed(function (result) {
        console.log(nuxtApp.$Quagga.canvas)
      const drawingCtx = nuxtApp.$Quagga.canvas.ctx.overlay;
      const drawingCanvas = nuxtApp.$Quagga.canvas.dom.overlay;
      let area;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute("width")),
            parseInt(drawingCanvas.getAttribute("height"))
          );
          result.boxes
            .filter(function (box) {
              return box !== result.box;
            })
            .forEach(function (box) {
              nuxtApp.$Quagga.ImageDebug.drawPath(
                box,
                { x: 0, y: 1 },
                drawingCtx,
                { color: "green", lineWidth: 2 }
              );
            });
        }

        if (result.box) {
          nuxtApp.$Quagga.ImageDebug.drawPath(
            result.box,
            { x: 0, y: 1 },
            drawingCtx,
            { color: "#00F", lineWidth: 2 }
          );
        }

        if (result.codeResult && result.codeResult.code) {
          nuxtApp.$Quagga.ImageDebug.drawPath(
            result.line,
            { x: "x", y: "y" },
            drawingCtx,
            { color: "red", lineWidth: 3 }
          );
        }
      }
    });

    // nuxtApp.$Quagga.onDetected(function (result) {
    //   const code = result.codeResult.code,
    //     $node,
    //     canvas = nuxtApp.$Quagga.canvas.dom.image;

    //   $node = $(
    //     '<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>'
    //   );
    //   $node.find("img").attr("src", canvas.toDataURL());
    //   $node.find("h4.code").html(code);
    //   $("#result_strip ul.thumbnails").prepend($node);
    // });
  });
};
