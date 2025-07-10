export interface Suggestion {
  text: string;
  postbackData: string;
}

export interface TemplateVariable {
  name: string;
  type: "String" | "Integer" | "Boolean" | "Float";
}

export interface TemplateContent {
  text: string;
  suggestions: Suggestion[];
}

export interface Template {
  template_type: string;
  name: string;
  content: TemplateContent;
  variables: Record<string, string>;
  category: string;
}

export const templateTypes = [
  { key: "text", label: "Text Template" },
  { key: "media", label: "Media Template" },
  { key: "carousel", label: "Carousel Template" },
];

export const categories = [
  { key: "conversational", label: "Conversational" },
  { key: "promotional", label: "Promotional" },
  { key: "transactional", label: "Transactional" },
  { key: "notification", label: "Notification" },
];

export const variableTypes = [
  { key: "String", label: "String" },
  { key: "Integer", label: "Integer" },
  { key: "Boolean", label: "Boolean" },
  { key: "Float", label: "Float" },
];
