export interface Message {
  id: string;
  platform: 'instagram' | 'whatsapp' | 'facebook';
  externalId: string;
  senderId: string;
  content: string;
  timestamp: Date;
  status: 'unread' | 'read' | 'responded';
}
