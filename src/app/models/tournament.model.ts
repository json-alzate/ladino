export interface Tournament {
    uid: string;
    name: string;
    description: string;
    startDate: number;
    endDate: number;
    createdAt: number;
    createdByUid: string;
    location: string;
    imageUrl: string;
    organizer: string;
    participants: string[];
    links: [];
    presentationHtml: string;
}