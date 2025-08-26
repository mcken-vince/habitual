import { renderHook, act } from '@testing-library/react';
import { useVisibleDates } from './useVisibleDates';

// Mock the dates utility functions
jest.mock('@/lib/dates', () => ({
  getDatesInRange: jest.fn(),
  parseDateStringLocal: jest.fn(),
}));

import { getDatesInRange, parseDateStringLocal } from '@/lib/dates';

const mockGetDatesInRange = getDatesInRange as jest.MockedFunction<typeof getDatesInRange>;
const mockParseDateStringLocal = parseDateStringLocal as jest.MockedFunction<typeof parseDateStringLocal>;

describe('useVisibleDates', () => {
  const mockDates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
  
  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    
    // Mock getDatesInRange to return test dates
    mockGetDatesInRange.mockReturnValue(mockDates);
    
    // Mock parseDateStringLocal to return a date
    mockParseDateStringLocal.mockImplementation((dateStr) => new Date(dateStr));
    
    // Mock addEventListener and removeEventListener
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
    addEventListenerSpy.mockImplementation(() => {});
    removeEventListenerSpy.mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should initialize with default visible dates', () => {
    const { result } = renderHook(() => useVisibleDates());
    
    expect(mockGetDatesInRange).toHaveBeenCalledWith(expect.any(Date), 5);
    expect(result.current.visibleDates).toEqual(mockDates);
    expect(result.current.visibleDatesCount).toBeGreaterThanOrEqual(5);
  });

  it('should calculate date count based on large screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    const { result } = renderHook(() => useVisibleDates());
    
    // Large screen: (1200 - 144) / 56 = 18.85, floored to 18
    expect(result.current.visibleDatesCount).toBe(18);
  });

  it('should calculate date count based on medium screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    const { result } = renderHook(() => useVisibleDates());
    
    // Medium screen: (768 - 144) / 48 = 13, floored to 13
    expect(result.current.visibleDatesCount).toBe(13);
  });

  it('should calculate date count based on small screen width', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });

    const { result } = renderHook(() => useVisibleDates());
    
    // Small screen: (480 - 144) / 40 = 8.4, floored to 8
    expect(result.current.visibleDatesCount).toBe(8);
  });

  it('should ensure minimum of 5 dates for very small screens', () => {
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 200,
    });

    const { result } = renderHook(() => useVisibleDates());
    
    // Very small screen: should default to minimum of 5
    expect(result.current.visibleDatesCount).toBe(5);
  });

  it('should set up and clean up resize event listener', () => {
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

    const { unmount } = renderHook(() => useVisibleDates());
    
    expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
    
    unmount();
    
    expect(removeEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
  });

  it('should recalculate dates when screen size changes', () => {
    // Start with large screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });

    let resizeHandler: ((event: Event) => void) | undefined;
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    addEventListenerSpy.mockImplementation((event, handler) => {
      if (event === 'resize') {
        resizeHandler = handler as (event: Event) => void;
      }
    });

    const { result } = renderHook(() => useVisibleDates());
    
    expect(result.current.visibleDatesCount).toBe(18);
    
    // Change to small screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 480,
    });
    
    // Trigger resize event
    act(() => {
      if (resizeHandler) {
        resizeHandler(new Event('resize'));
      }
    });
    
    expect(result.current.visibleDatesCount).toBe(8);
    expect(mockGetDatesInRange).toHaveBeenCalledWith(expect.any(Date), 8);
  });

  it('should allow setting visible dates manually', () => {
    const { result } = renderHook(() => useVisibleDates());
    const newDates = ['2024-02-01', '2024-02-02', '2024-02-03'];
    
    act(() => {
      result.current.setVisibleDates(newDates);
    });
    
    expect(result.current.visibleDates).toEqual(newDates);
  });

  it('should update visible dates when count changes due to resize', () => {
    const firstCallDates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05'];
    const secondCallDates = ['2024-01-01', '2024-01-02', '2024-01-03', '2024-01-04', '2024-01-05', '2024-01-06', '2024-01-07', '2024-01-08'];
    
    mockGetDatesInRange
      .mockReturnValueOnce(firstCallDates)
      .mockReturnValueOnce(secondCallDates);

    // Start with medium screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 768,
    });

    let resizeHandler: ((event: Event) => void) | undefined;
    const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
    addEventListenerSpy.mockImplementation((event, handler) => {
      if (event === 'resize') {
        resizeHandler = handler as (event: Event) => void;
      }
    });

    const { result } = renderHook(() => useVisibleDates());
    
    expect(result.current.visibleDates).toEqual(firstCallDates);
    
    // Change to large screen
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1200,
    });
    
    // Trigger resize event
    act(() => {
      if (resizeHandler) {
        resizeHandler(new Event('resize'));
      }
    });
    
    expect(mockParseDateStringLocal).toHaveBeenCalledWith(firstCallDates[0]);
    expect(mockGetDatesInRange).toHaveBeenCalledWith(expect.any(Date), 18);
  });
});
