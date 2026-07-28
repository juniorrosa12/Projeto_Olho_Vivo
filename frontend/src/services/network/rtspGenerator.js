/**
 * Utility to generate RTSP URLs automatically based on DVR Manufacturer, IP, Port, Channel and Credentials.
 */
export function generateRtspUrl({ manufacturer, ip, port = 554, user, password, channel = 1 }) {
  const cleanUser = encodeURIComponent(user || 'admin');
  const cleanPass = encodeURIComponent(password || '');
  const auth = cleanPass ? `${cleanUser}:${cleanPass}@` : `${cleanUser}@`;

  switch (manufacturer?.toUpperCase()) {
    case 'HIKVISION':
      return `rtsp://${auth}${ip}:${port}/Streaming/Channels/${channel}01`;
    case 'DAHUA':
    case 'INTELBRAS':
      return `rtsp://${auth}${ip}:${port}/cam/realmonitor?channel=${channel}&subtype=0`;
    case 'UNIVIEW':
      return `rtsp://${auth}${ip}:${port}/unicast/c${channel}/s0/live`;
    default:
      return `rtsp://${auth}${ip}:${port}/h264/ch${channel}/main/av_stream`;
  }
}
