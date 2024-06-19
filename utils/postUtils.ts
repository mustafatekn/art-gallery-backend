export function generateUrlFromTitle(title: string) {
    const normalizedTitle = title.normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

    const urlFriendlyTitle = normalizedTitle
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')

    return urlFriendlyTitle;
}