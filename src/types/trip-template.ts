export interface Province {
    id: string;
    name: string;
    code: number;
    divisionType: string;
    codename: string;
    phoneCode: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TripTemplateActivity {
    id: string;
    title: string;
    startTime?: string | null;
    durationMin?: number | null;
    location?: string | null;
    notes?: string | null;
    important: boolean;
    activityOrder: number;
    dayId: string;
}

export interface TripTemplateDay {
    id: string;
    title: string;
    description?: string | null;
    dayOrder: number;
    tripTemplateId: string;
    activities?: TripTemplateActivity[];
}

export interface TripTemplate {
    id: string;
    title: string;
    description?: string | null;
    provinceId?: string | null;
    isPublic: boolean;
    createdAt: Date;
    updatedAt: Date;
    avatar?: string | null;
    fee: number;
    province?: Province | null;
    days?: TripTemplateDay[];
}

export interface TripTemplateListResponse {
    data: TripTemplate[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        totalPages: number;
    };
}
