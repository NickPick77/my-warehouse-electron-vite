import { QuaggaImageObject } from '@renderer/types/quagga'
import { inject, onMounted } from 'vue'

export const useQuaggaScanRectangle = () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const $Quagga: any = inject('Quagga')

  // const resultCollector = Quagga.ResultCollector.create({
  //   capture: true, // keep track of the image producing this result
  //   capacity: 20, // maximum number of results to store
  //   blacklist: [
  //     // list containing codes which should not be recorded
  //     { code: '3574660239843', format: 'ean_13' }
  //   ],
  //   filter: function (codeResult) {
  //     // only store results which match this constraint
  //     // returns true/false
  //     // e.g.: return codeResult.format === "ean_13";
  //     return true
  //   }
  // })

  onMounted(() => {
    $Quagga.onProcessed(function (result: QuaggaImageObject) {
      const drawingCtx = $Quagga.canvas.ctx.overlay
      const drawingCanvas = $Quagga.canvas.dom.overlay

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width')),
            parseInt(drawingCanvas.getAttribute('height'))
          )
          result.boxes
            .filter(function (box) {
              return box !== result.box
            })
            .forEach(function (box) {
              $Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: 'green',
                lineWidth: 2
              })
            })
        }

        if (result.box) {
          $Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: '#00F',
            lineWidth: 2
          })
        }

        if (result.codeResult && result.codeResult.code) {
          $Quagga.ImageDebug.drawPath(result.line, { x: 'x', y: 'y' }, drawingCtx, {
            color: 'red',
            lineWidth: 3
          })
        }
      }
    })

    $Quagga.onDetected(() => {
      console.log('e che cazzo')
    })

    // $Quagga.onDetected(function (result) {
    //   const code = result.codeResult.code,
    //     $node,
    //     canvas = $Quagga.canvas.dom.image;

    //   $node = $(
    //     '<li><div class="thumbnail"><div class="imgWrapper"><img /></div><div class="caption"><h4 class="code"></h4></div></div></li>'
    //   );
    //   $node.find("img").attr("src", canvas.toDataURL());
    //   $node.find("h4.code").html(code);
    //   $("#result_strip ul.thumbnails").prepend($node);
    // });
  })
}
