export function detectDeviceTier() {
  const gl = document.createElement('canvas').getContext('webgl');
  const gpu = gl.getExtension('WEBGL_debug_renderer_info');
  const gpuName = gpu ? gl.getParameter(gpu.UNMASKED_RENDERER_WEBGL) : '';
  console.log('GPU Name:', gpuName);

  const lowEnd = /mali|powervr|intel|hd graphics|radeon\s?(vega|rx)?|adreno\s?[0-5]/i;

  const midRange = /geforce\s?gtx\s?(?!1070|1080)[0-9]{3}|adreno\s?[6-7]/i;

  const highEnd = /geforce\s?(rtx\s?[0-9]{4}|gtx\s?(1070|1080|16[0-9]{2}|[2-9][0-9]{2,}))/i;

  if (lowEnd.test(gpuName)) return 'low';
  if (highEnd.test(gpuName)) return 'high';
  if (midRange.test(gpuName)) return 'mid';

  // Default fallback
  return 'low';
}
