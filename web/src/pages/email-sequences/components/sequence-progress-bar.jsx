import PropTypes from 'prop-types';
import { Group, Progress, Stack, Text } from '@mantine/core';

const SequenceProgressBar = ({ total, dropped }) => {
  const percentage = 100 - ((100 * dropped) / total);

  return (
    <Stack spacing={4}>
      <Progress value={percentage} size="lg" />
      <Group position="apart" px={4}>
        <Text size="xs">
          {`Completed: ${total - dropped}`}
        </Text>
        <Text size="xs">
          {`Dropped: ${dropped}`}
        </Text>
      </Group>
    </Stack>
  );
};

SequenceProgressBar.propTypes = {
  total: PropTypes.number.isRequired,
  dropped: PropTypes.number.isRequired,
};

export default SequenceProgressBar;