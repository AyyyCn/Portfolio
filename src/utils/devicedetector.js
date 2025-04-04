export function detectDeviceTier() {
    const gl = document.createElement('canvas').getContext('webgl');
    const gpu = gl.getExtension('WEBGL_debug_renderer_info');
    const gpuName = gpu ? gl.getParameter(gpu.UNMASKED_RENDERER_WEBGL) : '';
  
    const lowEnd = /mali|powervr|intel|hd graphics|adreno\s?[0-5]/i;
    const midRange = /adreno\s?[6-7]|geforce\s?(gtx)?\s?(1050|1650|mx)/i;
  
    if (lowEnd.test(gpuName)) return 'low';
    if (midRange.test(gpuName)) return 'mid';
    return 'high';
  }
  