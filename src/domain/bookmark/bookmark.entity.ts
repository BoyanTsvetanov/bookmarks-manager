export interface BookmarkProps {
  id: string;
  url: string;
  title: string;
  description?: string;
  tags: string[];
  createdAt: Date;
  userId: string;
}

export class Bookmark {
  constructor(private props: BookmarkProps) {}

  get id() {
    return this.props.id;
  }

  get url() {
    return this.props.url;
  }

  get title() {
    return this.props.title;
  }

  get description() {
    return this.props.description;
  }

  get tags() {
    return this.props.tags;
  }

  get createdAt() {
    return this.props.createdAt;
  }
  
  get userId() {
    return this.props.userId;
  }

  toJSON() {
    return this.props;
  }
}
