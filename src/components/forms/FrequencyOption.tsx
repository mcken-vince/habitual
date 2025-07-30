import type { FrequencyType } from "@/types";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { useEffect, useMemo, useState } from "react";

interface FrequencyOptionProps {
  id: FrequencyType;
  isSelected: boolean;
  onSelect: (type: FrequencyType) => void;
  onUpdate: (days: number, times: number) => void;
  initialDays?: number;
  initialTimes?: number;
}

export function FrequencyOption({ id, isSelected, onSelect, onUpdate, initialDays, initialTimes }: FrequencyOptionProps) {
  const OptionComponent: React.FC<OptionStateProps> = useMemo(() => {
    switch (id) {
      case 'everyDay':
        return EveryDayOption;
      case 'everyXDays':
        return EveryXDaysOption;
      case 'timesPerWeek':
        return TimesPerWeekOption;
      case 'timesPerMonth':
        return TimesPerMonthOption;
      case 'timesInXDays':
        return TimesInXDaysOption;
    }
  }, [id]);
  return (
    <div className="flex items-center gap-2">
      <RadioGroupItem value={id} id={id} />
      <label
        htmlFor={id}
        className="cursor-pointer flex items-center"
        onClick={() => onSelect(id)}
      >
        <OptionComponent onUpdate={onUpdate} isSelected={isSelected} initialDays={initialDays} initialTimes={initialTimes} />
      </label>
    </div>
  );
}

interface OptionStateProps {
  isSelected: boolean;
  onUpdate: (days: number, times: number) => void;
  initialDays?: number;
  initialTimes?: number;
}

const EveryDayOption: React.FC<OptionStateProps> = ({ onUpdate }) => {
  // Every day is always 1 day, 1 time
  useEffect(() => {
    onUpdate(1, 1);
  }, [onUpdate]);

  return <>Every day</>;
};

const EveryXDaysOption: React.FC<OptionStateProps> = ({
  isSelected,
  onUpdate,
  initialDays = 2
}) => {
  const [days, setDays] = useState(initialDays);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 2) {
      setDays(value);
      if (isSelected) {
        onUpdate(value, 1);
      }
    }
  };

  useEffect(() => {
    if (isSelected) {
      onUpdate(days, 1);
    }
  }, [isSelected, days, onUpdate]);

  return (
    <>
      Every
      <Input
        type="number"
        className="inline w-14 mx-2"
        value={days}
        onChange={handleChange}
        min={2}
        onClick={(e) => e.stopPropagation()}
      />
      days
    </>
  );
};

const TimesPerWeekOption: React.FC<OptionStateProps> = ({
  isSelected,
  onUpdate,
  initialTimes = 3
}) => {
  const [times, setTimes] = useState(Math.min(initialTimes, 7));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 7) {
      setTimes(value);
      if (isSelected) {
        onUpdate(7, value);
      }
    }
  };

  useEffect(() => {
    if (isSelected) {
      onUpdate(7, times);
    }
  }, [isSelected, times, onUpdate]);

  return (
    <>
      <Input
        type="number"
        className="inline w-14 mx-2"
        value={times}
        onChange={handleChange}
        min={1}
        max={7}
        onClick={(e) => e.stopPropagation()}
      />
      times per week
    </>
  );
};

const TimesPerMonthOption: React.FC<OptionStateProps> = ({
  isSelected,
  onUpdate,
  initialTimes = 10
}) => {
  const [times, setTimes] = useState(Math.min(initialTimes, 30));

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1 && value <= 30) {
      setTimes(value);
      if (isSelected) {
        onUpdate(30, value);
      }
    }
  };

  useEffect(() => {
    if (isSelected) {
      onUpdate(30, times);
    }
  }, [isSelected, times, onUpdate]);

  return (
    <>
      <Input
        type="number"
        className="inline w-14 mx-2"
        value={times}
        onChange={handleChange}
        min={1}
        max={30}
        onClick={(e) => e.stopPropagation()}
      />
      times per month
    </>
  );
};

const TimesInXDaysOption: React.FC<OptionStateProps> = ({
  isSelected,
  onUpdate,
  initialDays = 7,
  initialTimes = 3
}) => {
  const [days, setDays] = useState(initialDays);
  const [times, setTimes] = useState(initialTimes);

  const handleTimesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setTimes(value);
      if (isSelected) {
        onUpdate(days, value);
      }
    }
  };

  const handleDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (!isNaN(value) && value >= 1) {
      setDays(value);
      if (isSelected) {
        onUpdate(value, times);
      }
    }
  };

  useEffect(() => {
    if (isSelected) {
      onUpdate(days, times);
    }
  }, [isSelected, days, times, onUpdate]);

  return (
    <>
      <Input
        type="number"
        className="inline w-14 mx-2"
        value={times}
        onChange={handleTimesChange}
        min={1}
        onClick={(e) => e.stopPropagation()}
      />
      times in
      <Input
        type="number"
        className="inline w-14 mx-2"
        value={days}
        onChange={handleDaysChange}
        min={1}
        onClick={(e) => e.stopPropagation()}
      />
      days
    </>
  );
};
