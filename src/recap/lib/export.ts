import html2canvas from 'html2canvas'

export async function exportToPng(element: HTMLElement, filename = 'trade-recap.png'): Promise<void> {
  const canvas = await html2canvas(element, {
    backgroundColor: '#0a0a0f',
    scale: 2,
    useCORS: true,
    logging: false,
    width: element.scrollWidth,
    height: element.scrollHeight,
  })

  const link = document.createElement('a')
  link.download = filename
  link.href = canvas.toDataURL('image/png')
  link.click()
}

export async function exportAllCardsToPng(elements: HTMLElement[]): Promise<void> {
  for (let i = 0; i < elements.length; i++) {
    await exportToPng(elements[i], `trade-${String(i + 1).padStart(3, '0')}.png`)
    await new Promise(r => setTimeout(r, 100))
  }
}
