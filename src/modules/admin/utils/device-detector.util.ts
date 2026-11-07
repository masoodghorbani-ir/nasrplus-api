export interface ParsedDeviceInfo {
  device: string;
  browser: string;
  os: string;
  description: string;
}

/**
 * Parse User-Agent string to extract device, browser, and OS information.
 * Clean, lightweight implementation with zero external dependencies.
 */
export function parseUserAgent(userAgent?: string): ParsedDeviceInfo {
  if (!userAgent || typeof userAgent !== 'string' || !userAgent.trim()) {
    return {
      device: 'Unknown',
      browser: 'Unknown',
      os: 'Unknown',
      description: 'Unknown Device',
    };
  }

  const ua = userAgent.trim();

  // 1. Detect Operating System
  let os = 'Unknown OS';
  if (/windows nt 10\.0/i.test(ua)) {
    os = 'Windows 10/11';
  } else if (/windows nt 6\.3/i.test(ua)) {
    os = 'Windows 8.1';
  } else if (/windows nt 6\.2/i.test(ua)) {
    os = 'Windows 8';
  } else if (/windows nt 6\.1/i.test(ua)) {
    os = 'Windows 7';
  } else if (/windows/i.test(ua)) {
    os = 'Windows';
  } else if (/iphone/i.test(ua)) {
    os = 'iOS (iPhone)';
  } else if (/ipad/i.test(ua)) {
    os = 'iPadOS';
  } else if (/android/i.test(ua)) {
    const match = ua.match(/android\s+([\d.]+)/i);
    os = match ? `Android ${match[1]}` : 'Android';
  } else if (/macintosh|mac os x/i.test(ua)) {
    os = 'macOS';
  } else if (/linux/i.test(ua)) {
    os = 'Linux';
  }

  // 2. Detect Browser / Client
  let browser = 'Unknown Browser';
  if (/edg(?:e)?\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/edg(?:e)?\/([\d.]+)/i);
    browser = `Edge ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/opr\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/opr\/([\d.]+)/i);
    browser = `Opera ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/chrome\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/chrome\/([\d.]+)/i);
    browser = `Chrome ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/firefox\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/firefox\/([\d.]+)/i);
    browser = `Firefox ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/version\/([\d.]+).*safari/i.test(ua)) {
    const match = ua.match(/version\/([\d.]+).*safari/i);
    browser = `Safari ${match ? match[1].split('.')[0] : ''}`.trim();
  } else if (/postmanruntime\/([\d.]+)/i.test(ua)) {
    const match = ua.match(/postmanruntime\/([\d.]+)/i);
    browser = `Postman ${match ? match[1] : ''}`.trim();
  } else if (/curl\/([\d.]+)/i.test(ua)) {
    browser = 'cURL';
  }

  // 3. Detect Device Form Factor
  let device = 'Desktop';
  if (/ipad|tablet/i.test(ua)) {
    device = 'Tablet';
  } else if (/mobile|iphone|ipod|android/i.test(ua)) {
    device = 'Mobile';
  }

  const description = `${device} (${os} - ${browser})`;

  return {
    device,
    browser,
    os,
    description,
  };
}
