import { Test, TestingModule } from '@nestjs/testing';
import { SupabaseService } from './supabase.service';

jest.mock('../../supabase/supabase', () => ({
  supabase: {
    storage: {
      from: jest.fn().mockReturnThis(),
      upload: jest.fn().mockResolvedValue({ data: {}, error: null }),
      createSignedUrls: jest.fn().mockResolvedValue({ data: [], error: null }),
    },
  },
}));

describe('SupabaseService', () => {
  let service: SupabaseService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SupabaseService],
    }).compile();

    service = module.get<SupabaseService>(SupabaseService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
