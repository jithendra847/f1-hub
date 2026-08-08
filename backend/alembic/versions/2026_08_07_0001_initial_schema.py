"""Initial schema setup

Revision ID: 2026_08_07_0001
Revises: 
Create Date: 2026-08-07 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

revision: str = '2026_08_07_0001'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

def upgrade() -> None:
    # Users & Auth
    op.create_table(
        'users',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('email', sa.String(255), nullable=False, unique=True),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.Column('full_name', sa.String(255), nullable=True),
        sa.Column('role', sa.String(50), nullable=False, server_default='USER'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )
    op.create_index('idx_users_email', 'users', ['email'])
    op.create_index('idx_users_role', 'users', ['role'])

    op.create_table(
        'user_preferences',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False, unique=True),
        sa.Column('theme', sa.String(20), nullable=False, server_default='light'),
        sa.Column('preferred_units', sa.String(20), nullable=False, server_default='metric'),
        sa.Column('notification_settings', sa.JSON(), nullable=False, server_default='{}'),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'refresh_tokens',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('token', sa.String(512), nullable=False, unique=True),
        sa.Column('expires_at', sa.DateTime(), nullable=False),
        sa.Column('revoked', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )
    op.create_index('idx_refresh_tokens_user_id', 'refresh_tokens', ['user_id'])

    op.create_table(
        'user_favorites',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_type', sa.String(50), nullable=False),
        sa.Column('target_id', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('user_id', 'target_type', 'target_id', name='uq_user_favorite')
    )

    op.create_table(
        'user_bookmarks',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='CASCADE'), nullable=False),
        sa.Column('target_type', sa.String(50), nullable=False),
        sa.Column('target_id', sa.String(100), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'audit_logs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('user_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('users.id', ondelete='SET NULL'), nullable=True),
        sa.Column('action', sa.String(100), nullable=False),
        sa.Column('resource', sa.String(100), nullable=False),
        sa.Column('details', sa.JSON(), nullable=True),
        sa.Column('ip_address', sa.String(45), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    # Core F1 Entities
    op.create_table(
        'seasons',
        sa.Column('year', sa.Integer(), primary_key=True, autoincrement=False),
        sa.Column('wikipedia_url', sa.String(512), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'circuits',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('locality', sa.String(100), nullable=True),
        sa.Column('country', sa.String(100), nullable=True),
        sa.Column('latitude', sa.Float(), nullable=True),
        sa.Column('longitude', sa.Float(), nullable=True),
        sa.Column('length_km', sa.Float(), nullable=True),
        sa.Column('turns', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'constructors',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('nationality', sa.String(100), nullable=True),
        sa.Column('color_hex', sa.String(10), nullable=True),
        sa.Column('logo_url', sa.String(512), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'drivers',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('driver_code', sa.String(10), nullable=True),
        sa.Column('first_name', sa.String(100), nullable=False),
        sa.Column('last_name', sa.String(100), nullable=False),
        sa.Column('nationality', sa.String(100), nullable=True),
        sa.Column('permanent_number', sa.Integer(), nullable=True),
        sa.Column('date_of_birth', sa.Date(), nullable=True),
        sa.Column('image_url', sa.String(512), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'driver_constructor_history',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('driver_id', sa.String(100), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('constructor_id', sa.String(100), sa.ForeignKey('constructors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('season', sa.Integer(), sa.ForeignKey('seasons.year', ondelete='CASCADE'), nullable=False),
        sa.Column('round_start', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('round_end', sa.Integer(), nullable=True),
        sa.UniqueConstraint('driver_id', 'constructor_id', 'season', 'round_start', name='uq_driver_constructor_season')
    )

    op.create_table(
        'races',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('season', sa.Integer(), sa.ForeignKey('seasons.year', ondelete='CASCADE'), nullable=False),
        sa.Column('round', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(255), nullable=False),
        sa.Column('official_name', sa.String(255), nullable=True),
        sa.Column('circuit_id', sa.String(100), sa.ForeignKey('circuits.id', ondelete='CASCADE'), nullable=False),
        sa.Column('date', sa.Date(), nullable=False),
        sa.Column('status', sa.String(50), nullable=False, server_default='UPCOMING'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('season', 'round', name='uq_race_season_round')
    )

    op.create_table(
        'sessions',
        sa.Column('id', sa.String(100), primary_key=True),
        sa.Column('race_id', sa.String(100), sa.ForeignKey('races.id', ondelete='CASCADE'), nullable=False),
        sa.Column('type', sa.String(50), nullable=False),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('scheduled_start', sa.DateTime(), nullable=True),
        sa.Column('actual_start', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='SCHEDULED'),
        sa.Column('results_available', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'session_results',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('driver_id', sa.String(100), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('constructor_id', sa.String(100), sa.ForeignKey('constructors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('grid_position', sa.Integer(), nullable=True),
        sa.Column('finishing_position', sa.Integer(), nullable=True),
        sa.Column('points', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('laps_completed', sa.Integer(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='FINISHED'),
        sa.Column('fastest_lap', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('fastest_lap_time', sa.String(20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('session_id', 'driver_id', name='uq_session_driver_result')
    )
    op.create_index('idx_session_result_position', 'session_results', ['session_id', 'finishing_position'])

    op.create_table(
        'driver_standings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('season', sa.Integer(), sa.ForeignKey('seasons.year', ondelete='CASCADE'), nullable=False),
        sa.Column('round', sa.Integer(), nullable=False),
        sa.Column('driver_id', sa.String(100), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('constructor_id', sa.String(100), sa.ForeignKey('constructors.id', ondelete='CASCADE'), nullable=True),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('points', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('wins', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('podiums', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('season', 'round', 'driver_id', name='uq_driver_standing_season_round')
    )
    op.create_index('idx_driver_standings_rank', 'driver_standings', ['season', 'round', 'position'])

    op.create_table(
        'constructor_standings',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('season', sa.Integer(), sa.ForeignKey('seasons.year', ondelete='CASCADE'), nullable=False),
        sa.Column('round', sa.Integer(), nullable=False),
        sa.Column('constructor_id', sa.String(100), sa.ForeignKey('constructors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('position', sa.Integer(), nullable=False),
        sa.Column('points', sa.Float(), nullable=False, server_default='0.0'),
        sa.Column('wins', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('podiums', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('season', 'round', 'constructor_id', name='uq_constructor_standing_season_round')
    )
    op.create_index('idx_constructor_standings_rank', 'constructor_standings', ['season', 'round', 'position'])

    # Analytics & Timing
    op.create_table(
        'laps',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('driver_id', sa.String(100), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('lap_number', sa.Integer(), nullable=False),
        sa.Column('lap_time_seconds', sa.Float(), nullable=True),
        sa.Column('is_personal_best', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('compound', sa.String(50), nullable=True),
        sa.Column('tyre_age', sa.Integer(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('session_id', 'driver_id', 'lap_number', name='uq_session_driver_lap')
    )
    op.create_index('idx_laps_session_driver', 'laps', ['session_id', 'driver_id'])

    op.create_table(
        'sectors',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('lap_id', postgresql.UUID(as_uuid=True), sa.ForeignKey('laps.id', ondelete='CASCADE'), nullable=False),
        sa.Column('sector_number', sa.Integer(), nullable=False),
        sa.Column('sector_time_seconds', sa.Float(), nullable=True),
        sa.Column('is_personal_best', sa.Boolean(), nullable=False, server_default='false'),
        sa.UniqueConstraint('lap_id', 'sector_number', name='uq_lap_sector')
    )

    op.create_table(
        'pit_stops',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('driver_id', sa.String(100), sa.ForeignKey('drivers.id', ondelete='CASCADE'), nullable=False),
        sa.Column('lap_number', sa.Integer(), nullable=False),
        sa.Column('stop_number', sa.Integer(), nullable=False),
        sa.Column('duration_seconds', sa.Float(), nullable=True),
        sa.Column('total_pit_duration', sa.Float(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.UniqueConstraint('session_id', 'driver_id', 'stop_number', name='uq_pit_stop_session_driver_stop')
    )

    op.create_table(
        'weather',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('air_temp', sa.Float(), nullable=True),
        sa.Column('track_temp', sa.Float(), nullable=True),
        sa.Column('humidity', sa.Float(), nullable=True),
        sa.Column('pressure', sa.Float(), nullable=True),
        sa.Column('wind_speed', sa.Float(), nullable=True),
        sa.Column('wind_direction', sa.Integer(), nullable=True),
        sa.Column('rainfall', sa.Boolean(), nullable=False, server_default='false')
    )

    op.create_table(
        'track_status',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('status_code', sa.String(20), nullable=False),
        sa.Column('description', sa.String(255), nullable=True)
    )

    op.create_table(
        'race_control_messages',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('session_id', sa.String(100), sa.ForeignKey('sessions.id', ondelete='CASCADE'), nullable=False),
        sa.Column('timestamp', sa.DateTime(), nullable=False),
        sa.Column('flag', sa.String(50), nullable=True),
        sa.Column('message', sa.String(512), nullable=False),
        sa.Column('category', sa.String(50), nullable=True),
        sa.Column('scope', sa.String(50), nullable=True)
    )

    op.create_table(
        'technical_updates',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('race_id', sa.String(100), sa.ForeignKey('races.id', ondelete='CASCADE'), nullable=False),
        sa.Column('constructor_id', sa.String(100), sa.ForeignKey('constructors.id', ondelete='CASCADE'), nullable=False),
        sa.Column('category', sa.String(100), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('source_url', sa.String(512), nullable=True),
        sa.Column('verification_status', sa.String(50), nullable=False, server_default='OFFICIAL'),
        sa.Column('published_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )

    op.create_table(
        'news_articles',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('title', sa.String(512), nullable=False),
        sa.Column('subtitle', sa.String(512), nullable=True),
        sa.Column('summary', sa.Text(), nullable=False),
        sa.Column('author', sa.String(255), nullable=True),
        sa.Column('image_url', sa.String(512), nullable=True),
        sa.Column('source', sa.String(100), nullable=False),
        sa.Column('category', sa.String(50), nullable=False),
        sa.Column('article_url', sa.String(512), nullable=False, unique=True),
        sa.Column('confidence_score', sa.Float(), nullable=False, server_default='1.0'),
        sa.Column('provider', sa.String(50), nullable=False),
        sa.Column('verification_status', sa.String(50), nullable=False, server_default='VERIFIED'),
        sa.Column('published_at', sa.DateTime(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now())
    )
    op.create_index('idx_news_source', 'news_articles', ['source'])
    op.create_index('idx_news_category', 'news_articles', ['category'])
    op.create_index('idx_news_published_at', 'news_articles', ['published_at'])

    op.create_table(
        'data_sync_runs',
        sa.Column('id', postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column('provider', sa.String(100), nullable=False),
        sa.Column('job_name', sa.String(100), nullable=False),
        sa.Column('started_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('status', sa.String(50), nullable=False, server_default='RUNNING'),
        sa.Column('records_processed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('records_changed', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('error_message', sa.Text(), nullable=True)
    )
    op.create_index('idx_sync_provider', 'data_sync_runs', ['provider'])
    op.create_index('idx_sync_job_name', 'data_sync_runs', ['job_name'])

    op.create_table(
        'data_sources',
        sa.Column('id', sa.String(50), primary_key=True),
        sa.Column('name', sa.String(100), nullable=False),
        sa.Column('base_url', sa.String(512), nullable=True),
        sa.Column('is_active', sa.String(20), nullable=False, server_default='ACTIVE'),
        sa.Column('priority', sa.Integer(), nullable=False, server_default='1'),
        sa.Column('last_synced_at', sa.DateTime(), nullable=True)
    )

def downgrade() -> None:
    op.drop_table('data_sources')
    op.drop_table('data_sync_runs')
    op.drop_table('news_articles')
    op.drop_table('technical_updates')
    op.drop_table('race_control_messages')
    op.drop_table('track_status')
    op.drop_table('weather')
    op.drop_table('pit_stops')
    op.drop_table('sectors')
    op.drop_table('laps')
    op.drop_table('constructor_standings')
    op.drop_table('driver_standings')
    op.drop_table('session_results')
    op.drop_table('sessions')
    op.drop_table('races')
    op.drop_table('driver_constructor_history')
    op.drop_table('drivers')
    op.drop_table('constructors')
    op.drop_table('circuits')
    op.drop_table('seasons')
    op.drop_table('audit_logs')
    op.drop_table('user_bookmarks')
    op.drop_table('user_favorites')
    op.drop_table('refresh_tokens')
    op.drop_table('user_preferences')
    op.drop_table('users')
